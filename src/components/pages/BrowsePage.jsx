import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import FilterSidebar from '@/components/molecules/FilterSection'
import PropertyTypeSwitch from '@/components/molecules/PropertyTypeSwitch'
import SearchBar from '@/components/molecules/SearchBar'
import FloatingLandSidebar from '@/components/molecules/FloatingLandSidebar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { getLandListings, getConceptPlans, getShowcaseProjects } from '@/services/api/propertyService'
const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLand, setSelectedLand] = useState(null)
  // Filter state
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    region: searchParams.get('region') || '',
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: searchParams.get('type') || '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    garageSpaces: ''
  })
  
  useEffect(() => {
    loadProperties()
  }, [])
  
  useEffect(() => {
    applyFilters()
  }, [properties, filters, activeType])
  
  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [landListings, conceptPlans, showcaseProjects] = await Promise.all([
        getLandListings(),
        getConceptPlans(),
        getShowcaseProjects()
      ])
      
      const allProperties = [
        ...landListings.map(p => ({ ...p, type: 'land' })),
        ...conceptPlans.map(p => ({ ...p, type: 'concept' })),
        ...showcaseProjects.map(p => ({ ...p, type: 'showcase' }))
      ]
      
      setProperties(allProperties)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const applyFilters = () => {
    let filtered = [...properties]
    
    // Filter by type
    if (activeType !== 'all') {
      filtered = filtered.filter(p => p.type === activeType)
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        (p.title || p.name || '').toLowerCase().includes(searchLower) ||
        (p.location || '').toLowerCase().includes(searchLower) ||
        (p.region || '').toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower)
      )
    }
    
    // Region filter
    if (filters.region) {
      filtered = filtered.filter(p => 
        p.region && p.region.toLowerCase() === filters.region.toLowerCase()
      )
    }
    
    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      filtered = filtered.filter(p => 
        (p.location || '').toLowerCase().includes(locationLower)
      )
    }
    
    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => 
        (p.price || p.estimatedPrice || 0) >= parseInt(filters.minPrice)
      )
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(p => 
        (p.price || p.estimatedPrice || 0) <= parseInt(filters.maxPrice)
      )
    }
    
    // Property features filter
    if (filters.bedrooms) {
      filtered = filtered.filter(p => 
        p.bedrooms >= parseInt(filters.bedrooms)
      )
    }
    
    if (filters.bathrooms) {
      filtered = filtered.filter(p => 
        p.bathrooms >= parseInt(filters.bathrooms)
      )
    }
    
    if (filters.minArea) {
      filtered = filtered.filter(p => 
        (p.area || p.floorArea || 0) >= parseInt(filters.minArea)
      )
    }
    
    if (filters.garageSpaces) {
      filtered = filtered.filter(p => 
        p.garageSpaces >= parseInt(filters.garageSpaces)
      )
    }
    
    setFilteredProperties(filtered)
  }
  
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    updateSearchParams({ search: searchTerm })
  }
  
  const handleTypeChange = (type) => {
    setActiveType(type)
    updateSearchParams({ type: type === 'all' ? null : type })
  }
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const handleResetFilters = () => {
    setFilters({
      search: '',
      region: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      garageSpaces: ''
    })
    setActiveType('all')
    setSearchParams({})
  }
  
  const updateSearchParams = (params) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }
  
  const getTypeOptions = () => {
    const allOption = { value: 'all', label: 'All Properties' }
    const typeOptions = [
      { value: 'land', label: 'Land Only' },
      { value: 'concept', label: 'Concept Plans' },
      { value: 'showcase', label: 'Showcase Projects' }
    ]
return [allOption, ...typeOptions]
  }
  
  const handleLandSelect = (landProperty) => {
    if (landProperty.type === 'land') {
      setSelectedLand(landProperty)
    }
  }
  
  const handleCloseLandSidebar = () => {
    setSelectedLand(null)
  }
  
  const handleMatchWithConcept = (landProperty) => {
    // Switch to concept plans view for matching
    setActiveType('concept')
    updateSearchParams({ type: 'concept' })
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                icon={showFilters ? "X" : "Filter"}
                className="lg:hidden"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
            
            {/* Property Type Switch */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <PropertyTypeSwitch 
                activeType={activeType} 
                onTypeChange={handleTypeChange} 
              />
              
              <div className="flex-1 max-w-md">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Search properties..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 lg:flex-shrink-0`}>
            <div className="sticky top-4">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
          
          {/* Properties Grid */}
<div className="flex-1">
            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              error={error}
              onRetry={loadProperties}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              propertyType={activeType}
              showMatchScores={false}
              onLandSelect={handleLandSelect}
            />
          </div>
</div>
      </div>
      
      {/* Floating Land Sidebar */}
      <FloatingLandSidebar
        selectedLand={selectedLand}
        onClose={handleCloseLandSidebar}
        onMatchWithConcept={handleMatchWithConcept}
      />
    </div>
  )
}

export default BrowsePage