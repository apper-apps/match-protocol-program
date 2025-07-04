import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'default',
  hover = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-300'
  
  const variants = {
    default: 'shadow-md border border-gray-100',
    elevated: 'shadow-lg border border-gray-100',
    outlined: 'border-2 border-gray-200 shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}`
  
  const cardProps = {
    className: classes,
    onClick: onClick,
    ...props
  }
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ 
          scale: 1.02, 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        }}
        transition={{ duration: 0.2 }}
        {...cardProps}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div {...cardProps}>
      {children}
    </div>
  )
}

export default Card