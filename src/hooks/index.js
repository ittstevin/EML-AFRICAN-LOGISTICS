import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

// Hook for API calls
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiFunction(...args)
        setData(response.data)
        return response.data
      } catch (err) {
        const message = err.response?.data?.message || 'An error occurred'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction]
  )

  return { data, isLoading, error, execute }
}

// Hook for mutations with toast notifications
export const useMutation = (apiFunction, options = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiFunction(...args)
        if (options.onSuccess) {
          options.onSuccess(response.data)
        }
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        return response.data
      } catch (err) {
        const message = err.response?.data?.message || options.errorMessage || 'An error occurred'
        setError(message)
        toast.error(message)
        if (options.onError) {
          options.onError(err)
        }
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction, options]
  )

  return { isLoading, error, mutate }
}

// Hook for form handling
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }, [touched])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (err) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit]
  )

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  }
}

// Hook for pagination
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
  }
}

// Hook for search and filter
export const useSearch = (items, searchKey) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true
    const value = item[searchKey]?.toString().toLowerCase()
    return value?.includes(searchTerm.toLowerCase())
  })

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  }
}

// Hook for localStorage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Hook for modal
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
