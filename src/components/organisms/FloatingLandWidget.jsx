import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const FloatingLandWidget = ({ selectedLand, onClose, onClearSelection }) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (!selectedLand) return null

  function handleImageError() {
    setImageError(true)
    setImageLoading(false)
  }

  function handleImageLoad() {
    setImageLoading(false)
  }

  function getImageSrc() {
    if (imageError) {
      return `https://via.placeholder.com/120x90/40916C/FFFFFF?text=${encodeURIComponent(selectedLand.title || 'Land')}`
    }
    
    const primaryImage = selectedLand.images?.[0] || selectedLand.image
    if (!primaryImage) {
      return `https://via.placeholder.com/120x90/40916C/FFFFFF?text=${encodeURIComponent(selectedLand.title || 'Land')}`
    }
    
    return primaryImage
  }

  function formatPrice(price, priceType) {
    if (!price) return 'Price on enquiry'
    return `$${price.toLocaleString()}${priceType === 'weekly' ? '/week' : ''}`
  }

  function handleFindMatches() {
    navigate('/matches', { 
      state: { 
        selectedLand: selectedLand,
        searchType: 'concept' 
      } 
    })
    toast.success('Finding concept plan matches for your selected land!')
  }

  function handleFindShowcase() {
    navigate('/matches', { 
      state: { 
        selectedLand: selectedLand,
        searchType: 'showcase' 
      } 
    })
    toast.success('Finding showcase project matches for your selected land!')
  }

  function handleViewDetails() {
    navigate(`/property/${selectedLand.Id}`)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-20 right-4 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-hidden"
      >
        <Card className="shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Selected Land</h3>
                <p className="text-xs text-gray-500">Ready for matching</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                icon="X"
                className="w-8 h-8 p-0"
              />
            </div>
          </div>

          {/* Land Details */}
          <div className="p-4">
            <div className="flex gap-3 mb-4">
              {/* Land Image */}
              <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <ApperIcon name="Image" size={16} className="text-gray-400" />
                  </div>
                )}
                <img 
                  src={getImageSrc()}
                  alt={selectedLand.title || 'Selected Land'} 
                  className={`w-full h-full object-cover ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>

              {/* Land Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
                  {selectedLand.title || selectedLand.name}
                </h4>
                
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <ApperIcon name="MapPin" size={12} className="mr-1" />
                  <span className="truncate">{selectedLand.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-primary">
                    {formatPrice(selectedLand.price || selectedLand.estimatedPrice, selectedLand.priceType)}
                  </div>
                  {selectedLand.area && (
                    <div className="text-xs text-gray-500">
                      {selectedLand.area}m²
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Region Badge */}
            {selectedLand.region && (
              <div className="mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedLand.region}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleFindMatches}
                icon="Heart"
                className="w-full"
              >
                Find Concept Plans
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindShowcase}
                icon="Home"
                className="w-full"
              >
                Find Showcase Projects
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                icon="Eye"
                className="w-full"
              >
                View Land Details
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Continue browsing to compare</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Active</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingLandWidget