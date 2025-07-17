import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

function PropertyCard({ property, type = 'land', showMatchScore = false, matchScore = 0, onViewDetails, onShortlist }) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
function handleViewDetails() {
    if (onViewDetails) {
      onViewDetails(property)
    } else {
      navigate(`/property/${property.Id}`)
    }
  }

  function handleImageError() {
    setImageError(true)
    setImageLoading(false)
  }

  function handleImageLoad() {
    setImageLoading(false)
  }

  function formatPrice(price, priceType) {
    if (!price) return 'Price on enquiry'
    return `$${price.toLocaleString()}${priceType === 'weekly' ? '/week' : ''}`
  }

  function getPropertyIcon() {
    return type === 'land' ? 'MapPin' : 'Home'
  }

function getPropertyTypeColor() {
    return type === 'land' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  function getImageSrc() {
    if (imageError) {
      return `https://via.placeholder.com/400x300/40916C/FFFFFF?text=${encodeURIComponent(property.title || 'Property Image')}`
    }
    
    const primaryImage = property.images?.[0] || property.image
    if (!primaryImage) {
      return `https://via.placeholder.com/400x300/40916C/FFFFFF?text=${encodeURIComponent(property.title || 'Property Image')}`
    }
    
    return primaryImage
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden group cursor-pointer property-card" onClick={handleViewDetails}>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <ApperIcon name="Image" size={48} className="text-gray-400" />
              </div>
            )}
            <img 
              src={getImageSrc()}
              alt={property.title || 'Property'} 
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>
          
          {/* Property Type & Match Score Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant={getPropertyTypeColor()} icon={getPropertyIcon()} size="sm">
              {type === 'land' ? 'Land' : type === 'concept' ? 'Plan' : 'Showcase'}
            </Badge>
            
            {showMatchScore && matchScore > 0 && (
              <Badge variant="accent" icon="Heart" size="sm">
                {matchScore}% Match
              </Badge>
            )}
          </div>
          
          {/* Region */}
          {property.region && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" size="sm">
                {property.region}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {property.title || property.name}
            </h3>
          </div>
          
          {/* Location */}
          {property.location && (
            <div className="flex items-center text-gray-600 mb-3">
              <ApperIcon name="MapPin" size={16} className="mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
          )}
          
          {/* Property details */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            {property.area && (
              <div className="flex items-center">
                <ApperIcon name="Square" size={16} className="mr-1" />
                <span>{property.area}m²</span>
              </div>
            )}
            
            {property.bedrooms && (
              <div className="flex items-center">
                <ApperIcon name="Bed" size={16} className="mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="flex items-center">
                <ApperIcon name="Bath" size={16} className="mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            
            {property.garageSpaces && (
              <div className="flex items-center">
                <ApperIcon name="Car" size={16} className="mr-1" />
                <span>{property.garageSpaces}</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price || property.estimatedPrice, property.priceType)}
            </div>
            
            {type === 'concept' && (
              <div className="text-xs text-gray-500">
                Est. build cost
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleViewDetails}
              className="flex-1"
            >
              View Details
            </Button>
            
<Button
              variant="ghost"
              size="sm"
              icon="Heart"
              onClick={(e) => {
                e.stopPropagation()
                toast.success('Added to favorites!')
              }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PropertyCard