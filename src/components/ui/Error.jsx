import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  showRetry = true,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center py-12 ${className}`}
    >
      <Card className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {showRetry && onRetry && (
          <div className="flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
            >
              Try Again
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              icon="Home"
            >
              Go Home
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Error