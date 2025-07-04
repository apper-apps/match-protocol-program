import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const FilterSection = ({ title, children, isOpen = false, onToggle }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-2 text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [openSections, setOpenSections] = useState({
    location: true,
    price: true,
    property: true,
    features: false
  })
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  const regions = [
    { value: 'auckland', label: 'Auckland' },
    { value: 'waikato', label: 'Waikato' },
    { value: 'bay-of-plenty', label: 'Bay of Plenty' },
    { value: 'wellington', label: 'Wellington' },
    { value: 'canterbury', label: 'Canterbury' },
    { value: 'otago', label: 'Otago' }
  ]
  
  const propertyTypes = [
    { value: 'land', label: 'Land Only' },
    { value: 'concept', label: 'Concept Plans' },
    { value: 'showcase', label: 'Showcase Projects' }
  ]
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          icon="RotateCcw"
        >
          Reset
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Location */}
        <FilterSection 
          title="Location" 
          isOpen={openSections.location}
          onToggle={() => toggleSection('location')}
        >
          <Select
            placeholder="Select region"
            options={regions}
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
          />
          
          <Input
            placeholder="Enter suburb or city"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            icon="MapPin"
          />
        </FilterSection>
        
        {/* Price */}
        <FilterSection 
          title="Price Range" 
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Min price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              icon="DollarSign"
            />
            <Input
              placeholder="Max price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              icon="DollarSign"
            />
          </div>
        </FilterSection>
        
        {/* Property Type */}
        <FilterSection 
          title="Property Type" 
          isOpen={openSections.property}
          onToggle={() => toggleSection('property')}
        >
          <Select
            placeholder="Select property type"
            options={propertyTypes}
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
          />
        </FilterSection>
        
        {/* Features */}
        <FilterSection 
          title="Features" 
          isOpen={openSections.features}
          onToggle={() => toggleSection('features')}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Bedrooms"
              type="number"
              value={filters.bedrooms}
              onChange={(e) => onFilterChange('bedrooms', e.target.value)}
              icon="Bed"
            />
            <Input
              placeholder="Bathrooms"
              type="number"
              value={filters.bathrooms}
              onChange={(e) => onFilterChange('bathrooms', e.target.value)}
              icon="Bath"
            />
          </div>
          
          <Input
            placeholder="Min floor area (m²)"
            type="number"
            value={filters.minArea}
            onChange={(e) => onFilterChange('minArea', e.target.value)}
            icon="Square"
          />
          
          <Input
            placeholder="Garage spaces"
            type="number"
            value={filters.garageSpaces}
            onChange={(e) => onFilterChange('garageSpaces', e.target.value)}
            icon="Car"
          />
        </FilterSection>
      </div>
    </div>
  )
}

export default FilterSidebar