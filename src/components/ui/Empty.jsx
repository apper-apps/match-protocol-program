import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No results found", 
  message = "Try adjusting your search criteria or browse all properties.",
  icon = "Search",
  actionText = "Clear Filters",
  onAction,
  showAction = true,
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
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} size={36} className="text-gray-400" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {showAction && onAction && (
          <div className="flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={onAction}
              icon="Filter"
            >
              {actionText}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/browse'}
              icon="Grid"
            >
              Browse All
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty