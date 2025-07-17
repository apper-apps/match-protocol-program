import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PropertyCard from '@/components/molecules/PropertyCard'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getShowcaseProjects } from '@/services/api/propertyService'

const ShowcaseProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    buildType: '',
    priceRange: ''
  })
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  useEffect(() => {
    applyFilters()
  }, [projects, filters])
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const projectsData = await getShowcaseProjects()
      setProjects(projectsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const applyFilters = () => {
    let filtered = [...projects]
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.location?.toLowerCase().includes(searchLower)
      )
    }
    
    // Region filter
    if (filters.region) {
      filtered = filtered.filter(project =>
        project.region && project.region.toLowerCase() === filters.region.toLowerCase()
      )
    }
    
    // Build type filter
    if (filters.buildType) {
      filtered = filtered.filter(project =>
        project.buildType && project.buildType.toLowerCase() === filters.buildType.toLowerCase()
      )
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p.replace(/[^\d]/g, '')))
      filtered = filtered.filter(project => {
        const cost = project.estimatedCost || 0
        return cost >= min * 1000 && (!max || cost <= max * 1000)
      })
    }
    
    setFilteredProjects(filtered)
  }
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowModal(true)
  }
  
  const handleContactBuilder = (project) => {
    navigate('/custom-build', { state: { selectedBuilder: project.builderId } })
  }
  
  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'auckland', label: 'Auckland' },
    { value: 'waikato', label: 'Waikato' },
    { value: 'bay-of-plenty', label: 'Bay of Plenty' },
    { value: 'wellington', label: 'Wellington' },
    { value: 'canterbury', label: 'Canterbury' },
    { value: 'otago', label: 'Otago' }
  ]
  
  const buildTypes = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'extension', label: 'Extension' }
  ]
  
  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '200-400', label: '$200k - $400k' },
    { value: '400-600', label: '$400k - $600k' },
    { value: '600-800', label: '$600k - $800k' },
    { value: '800-1000', label: '$800k - $1M' },
    { value: '1000-', label: '$1M+' }
  ]
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="grid" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error
          title="Failed to load showcase projects"
          message={error}
          onRetry={loadProjects}
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Showcase Projects
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get inspired by real completed projects from our trusted builder network
        </p>
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            icon="Search"
          />
          
          <Select
            options={regions}
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            placeholder="Select region"
          />
          
          <Select
            options={buildTypes}
            value={filters.buildType}
            onChange={(e) => handleFilterChange('buildType', e.target.value)}
            placeholder="Select build type"
          />
          
          <Select
            options={priceRanges}
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            placeholder="Select price range"
          />
        </div>
      </Card>
      
      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          message="Try adjusting your filters to see more results"
          icon="Award"
          actionText="Clear Filters"
          onAction={() => setFilters({ search: '', region: '', buildType: '', priceRange: '' })}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <Card hover className="overflow-hidden h-full">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.images?.[0] || '/api/placeholder/400/300'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="accent" icon="Award" size="sm">
                      Showcase
                    </Badge>
                    {project.region && (
                      <Badge variant="default" size="sm">
                        {project.region}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="Eye"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProjectClick(project)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  
                  {project.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <ApperIcon name="MapPin" size={16} className="mr-1" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description || project.story}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-primary">
                      ${project.estimatedCost?.toLocaleString() || 'POA'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. cost
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleContactBuilder(project)
                      }}
                      className="flex-1"
                    >
                      Contact Builder
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Heart"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle add to favorites
                      }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProject.title}
                  </h2>
                  {selectedProject.location && (
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="MapPin" size={16} className="mr-1" />
                      <span>{selectedProject.location}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedProject.images?.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedProject.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Project Story
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProject.story || selectedProject.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Project Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost</span>
                      <span className="font-medium">
                        ${selectedProject.estimatedCost?.toLocaleString() || 'POA'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region</span>
                      <span className="font-medium">{selectedProject.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Build Type</span>
                      <span className="font-medium">{selectedProject.buildType || 'Residential'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonials */}
              {selectedProject.testimonials && selectedProject.testimonials.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Client Testimonial
                  </h3>
                  <blockquote className="text-gray-700 italic">
                    "{selectedProject.testimonials[0].text}"
                  </blockquote>
                  <cite className="text-sm text-gray-500 mt-2 block">
                    - {selectedProject.testimonials[0].client}
                  </cite>
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleContactBuilder(selectedProject)}
                  icon="MessageCircle"
                  className="flex-1"
                >
                  Contact Builder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ShowcaseProjectsPage