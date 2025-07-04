import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-gradient-to-r from-accent to-yellow-400 text-white',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {icon && (
        <ApperIcon 
          name={icon} 
          size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  )
}

export default Badge