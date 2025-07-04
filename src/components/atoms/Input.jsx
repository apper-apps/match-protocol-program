import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  success,
  icon,
  iconPosition = 'left',
  className = '',
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1
    ${error ? 'border-error focus:border-error focus:ring-error/20' : 
      success ? 'border-success focus:border-success focus:ring-success/20' : 
      'border-gray-300 focus:border-primary focus:ring-primary/20'}
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-success flex items-center">
          <ApperIcon name="CheckCircle" size={16} className="mr-1" />
          {success}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input