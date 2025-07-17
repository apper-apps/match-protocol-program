import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";

const PropertyGrid = ({ 
  properties = [], 
  loading = false, 
  error = null, 
  onRetry,
  viewMode = 'grid',
  onViewModeChange,
  propertyType = 'all',
  showMatchScores = false,
  onLandSelect
}) => {
  const [sortBy, setSortBy] = useState('newest')
  const [sortedProperties, setSortedProperties] = useState([])
  
  useEffect(() => {
    let sorted = [...properties]
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.price || a.estimatedPrice || 0) - (b.price || b.estimatedPrice || 0))
        break
      case 'price-high':
        sorted.sort((a, b) => (b.price || b.estimatedPrice || 0) - (a.price || a.estimatedPrice || 0))
        break
      case 'area-large':
        sorted.sort((a, b) => (b.area || b.floorArea || 0) - (a.area || a.floorArea || 0))
        break
      case 'area-small':
        sorted.sort((a, b) => (a.area || a.floorArea || 0) - (b.area || b.floorArea || 0))
        break
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
    }
    
    setSortedProperties(sorted)
  }, [properties, sortBy])
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'area-large', label: 'Area: Large to Small' },
    { value: 'area-small', label: 'Area: Small to Large' }
  ]
  
  if (loading) {
    return <Loading type="grid" />
  }
  
  if (error) {
    return (
      <Error
        title="Failed to load properties"
        message={error}
        onRetry={onRetry}
      />
    )
  }
  
  if (properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        message="Try adjusting your search criteria or browse all properties."
        icon="Search"
        actionText="Clear Filters"
        onAction={onRetry}
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ApperIcon name="Grid3X3" size={20} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ApperIcon name="List" size={20} />
            </button>
          </div>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Properties Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${sortBy}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
{sortedProperties.map((property, index) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
<PropertyCard
                property={property}
                type={propertyType}
                showMatchScore={showMatchScores}
                matchScore={property.matchScore || Math.floor(Math.random() * 40) + 60}
                onViewDetails={property.type === 'land' && onLandSelect ? 
                  (prop) => onLandSelect(prop) : undefined
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PropertyGrid