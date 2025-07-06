import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PropertyCard from "@/components/molecules/PropertyCard";
import { getShowcaseProjects } from "@/services/api/propertyService";
function ShowcaseProjectsPage() {
const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [imageLoading, setImageLoading] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    buildType: '',
    priceRange: ''
  })
  
useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      setError(null)
      const data = await getShowcaseProjects()
      setProjects(data)
      
      // Initialize image loading states
      const initialLoading = {}
      data.forEach(project => {
        if (project.images) {
          project.images.forEach((_, imageIndex) => {
            initialLoading[`${project.Id}-${imageIndex}`] = true
          })
        }
      })
      setImageLoading(initialLoading)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleImageError(projectId, imageIndex) {
    const key = `${projectId}-${imageIndex}`
    setImageErrors(prev => ({ ...prev, [key]: true }))
    setImageLoading(prev => ({ ...prev, [key]: false }))
  }

  function handleImageLoad(projectId, imageIndex) {
    const key = `${projectId}-${imageIndex}`
    setImageLoading(prev => ({ ...prev, [key]: false }))
  }

  function getImageSrc(project, imageIndex = 0) {
    const key = `${project.Id}-${imageIndex}`
    
    if (imageErrors[key]) {
      return `https://via.placeholder.com/800x600/40916C/FFFFFF?text=${encodeURIComponent(project.title || 'Project Image')}`
    }
    
    const image = project.images?.[imageIndex]
    if (!image) {
      return `https://via.placeholder.com/800x600/40916C/FFFFFF?text=${encodeURIComponent(project.title || 'Project Image')}`
    }
    
    return image
  }

  function applyFilters() {
return projects.filter(project => {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = !filters.search || 
        project.title.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower) ||
        project.story.toLowerCase().includes(searchLower)
      
      const matchesRegion = !filters.region || project.region.toLowerCase() === filters.region.toLowerCase()
      const matchesBuildType = !filters.buildType || project.buildType === filters.buildType
      
      let matchesPriceRange = true
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        const cost = project.estimatedCost / 1000 // Convert to thousands
        matchesPriceRange = cost >= min && cost <= max
      }
      
      return matchesSearch && matchesRegion && matchesBuildType && matchesPriceRange
    })
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

function handleProjectClick(project) {
    setSelectedProject(project)
    setShowModal(true)
  }

  function handleContactBuilder(project) {
    navigate(`/builder/${project.builderId}`)
  }

  const projectsData = applyFilters()
  
  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'auckland', label: 'Auckland' },
    { value: 'waikato', label: 'Waikato' },
    { value: 'bay of plenty', label: 'Bay of Plenty' },
    { value: 'wellington', label: 'Wellington' },
    { value: 'canterbury', label: 'Canterbury' },
    { value: 'otago', label: 'Otago' }
  ]

  const buildTypes = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed-use', label: 'Mixed Use' }
  ]

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '200-400', label: '$200k - $400k' },
    { value: '400-600', label: '$400k - $600k' },
    { value: '600-800', label: '$600k - $800k' },
    { value: '800-1000', label: '$800k - $1M' },
    { value: '1000-1500', label: '$1M - $1.5M' },
{ value: '1500-2000', label: '$1.5M+' }
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

  const filtered = [...projectsData]
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
      {filtered.length === 0 ? (
        <Empty
          title="No projects found"
          description="Try adjusting your filters to find more projects"
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
                  {imageLoading[`${project.Id}-0`] && (
<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <ApperIcon name="Image" size={48} className="text-gray-400" />
                    </div>
                  )}
                  <img 
                    src={getImageSrc(project, 0)}
                    alt={project.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      imageLoading[`${project.Id}-0`] ? 'opacity-0' : 'opacity-100'
                    }`}
                    onError={() => handleImageError(project.Id, 0)}
                    onLoad={() => handleImageLoad(project.Id, 0)}
                    loading="lazy"
                  />
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
      
      {/* Modal */}
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