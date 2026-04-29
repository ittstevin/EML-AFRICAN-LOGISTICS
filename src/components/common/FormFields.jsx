export function TextInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
        } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Select({
  label,
  name,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
        } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Textarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 4,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors resize-none ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
        } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Checkbox({ label, name, checked, onChange, disabled = false, ...props }) {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed"
        {...props}
      />
      {label && (
        <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
      )}
    </div>
  )
}

export function RadioGroup({ label, name, options = [], value, onChange, error, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
              {...props}
            />
            <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{option.label}</label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
