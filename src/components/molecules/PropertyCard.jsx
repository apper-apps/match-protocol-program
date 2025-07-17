import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const PropertyCard = ({ property, type = 'land', showMatchScore = false, matchScore = 0, onLandSelect }) => {
  const navigate = useNavigate()
  
const handleViewDetails = () => {
    if (property?.Id) {
      navigate(`/property/${property.Id}`)
    }
  }
const formatPrice = (price, priceType) => {
    if (priceType === 'auction') return 'Auction'
    if (!price) return 'Price on application'
    return `$${price.toLocaleString()}`
  }
  
  const handleLandSelect = (e) => {
    e.stopPropagation()
    if (property.type === 'land' && onLandSelect) {
      onLandSelect(property)
    }
  }
  
  const getPropertyIcon = () => {
    switch (type) {
      case 'land': return 'MapPin'
      case 'concept': return 'Home'
      case 'showcase': return 'Award'
      default: return 'Building'
    }
  }
  
  const getPropertyTypeColor = () => {
    switch (type) {
      case 'land': return 'primary'
      case 'concept': return 'secondary'
      case 'showcase': return 'accent'
      default: return 'default'
    }
  }
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="overflow-hidden h-full">
        {/* Image */}
<div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={property.images?.[0] || '/api/placeholder/400/300'}
            alt={property.title || property.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300'
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
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
            
            {property.type === 'land' && onLandSelect ? (
              <Button
                variant="ghost"
                size="sm"
                icon="Plus"
                onClick={handleLandSelect}
                title="Select for matching"
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                icon="Heart"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle add to favorites
                }}
              />
            )}
</div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PropertyCard