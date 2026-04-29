export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 
        hover:shadow-lg transition-shadow duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>{children}</div>
}
