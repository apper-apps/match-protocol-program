import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FloatingLandSidebar = ({ selectedLand, onClose, onMatchWithConcept }) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const navigate = useNavigate()
  
  if (!selectedLand) return null
  
  const formatPrice = (price, priceType) => {
    if (priceType === 'poa') return 'POA'
    if (priceType === 'auction') return 'Auction'
    if (!price) return 'Price on application'
    return `$${price.toLocaleString()}`
  }
  
  const handleViewDetails = () => {
    navigate(`/property/${selectedLand.Id}`)
  }
  
  const handleMatchWithConcept = () => {
    onMatchWithConcept(selectedLand)
    toast.success('Ready to match with concept plans!')
  }
  
  const handleFindMatches = () => {
    navigate('/matches')
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-4 top-24 z-50 w-80 max-h-[calc(100vh-8rem)] overflow-hidden"
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ApperIcon name="MapPin" size={20} className="text-primary" />
                <h3 className="font-semibold text-gray-900">
                  {isMinimized ? 'Selected Land' : 'Land Selected'}
                </h3>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ApperIcon 
                    name={isMinimized ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-gray-500"
                  />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ApperIcon name="X" size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Land Image */}
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <img
                      src={selectedLand.images?.[0] || '/api/placeholder/400/300'}
                      alt={selectedLand.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/300'
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="primary" icon="MapPin" size="sm">
                        Land
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Land Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {selectedLand.title}
                    </h4>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <ApperIcon name="MapPin" size={14} className="mr-1" />
                      <span className="text-sm">{selectedLand.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(selectedLand.price, selectedLand.priceType)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedLand.area}m²
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleMatchWithConcept}
                      icon="Heart"
                      className="w-full"
                    >
                      Match with Concept Plans
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewDetails}
                        icon="Eye"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFindMatches}
                        icon="Search"
                        className="flex-1"
                      >
                        Find Matches
                      </Button>
                    </div>
                  </div>
                  
                  {/* Helper Text */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <ApperIcon name="Info" size={12} />
                      <span className="font-medium">Quick Match</span>
                    </div>
                    <p>
                      Browse concept plans and showcase projects to find the perfect match for this land.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingLandSidebar