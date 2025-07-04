import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option',
  error,
  success,
  className = '',
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-4 py-3 pr-10 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-white
    ${error ? 'border-error focus:border-error focus:ring-error/20' : 
      success ? 'border-success focus:border-success focus:ring-success/20' : 
      'border-gray-300 focus:border-primary focus:ring-primary/20'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
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
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={selectClasses}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
        </div>
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

Select.displayName = 'Select'

export default Select