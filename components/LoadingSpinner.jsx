import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'orange', 
  variant = 'spinner',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const colorClasses = {
    orange: 'border-orange-500',
    gray: 'border-gray-500',
    white: 'border-white'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}></div>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
      </div>
    )
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
  )
}

export default LoadingSpinner