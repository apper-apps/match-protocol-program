import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { getPropertyById } from "@/services/api/propertyService";

function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState({})
  const [imageLoading, setImageLoading] = useState({})
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  
  useEffect(() => {
    loadProperty()
  }, [id])

  async function loadProperty() {
    try {
      setLoading(true)
setError(null)
      const data = await getPropertyById(id)
      setProperty(data)
      
      // Initialize image loading states
      if (data?.images) {
        const initialLoading = {}
        data.images.forEach((_, index) => {
          initialLoading[index] = true
        })
        setImageLoading(initialLoading)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleImageError(index) {
    setImageErrors(prev => ({ ...prev, [index]: true }))
    setImageLoading(prev => ({ ...prev, [index]: false }))
  }

  function handleImageLoad(index) {
    setImageLoading(prev => ({ ...prev, [index]: false }))
  }

  function getImageSrc(image, index) {
    if (imageErrors[index]) {
      return `https://via.placeholder.com/800x600/40916C/FFFFFF?text=${encodeURIComponent(property?.title || 'Property Image')}`
    }
    
    if (!image) {
      return `https://via.placeholder.com/800x600/40916C/FFFFFF?text=${encodeURIComponent(property?.title || 'Property Image')}`
    }
    
    return image
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault()
    setEnquiryLoading(true)
    
    try {
// Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Enquiry submitted successfully!')
      setEnquiryForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (err) {
      toast.error('Failed to submit enquiry. Please try again.')
    } finally {
      setEnquiryLoading(false)
    }
  }

  function handleInputChange(field, value) {
    setEnquiryForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function formatPrice(price, priceType) {
if (!price) return 'Price on enquiry'
    return `$${price.toLocaleString()}${priceType === 'weekly' ? '/week' : ''}`
  }

  function getPropertyType() {
    return property?.type || 'land'
  }

if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!property) return <Error message="Property not found" />

  const images = property.images || []
  const propertyType = getPropertyType()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/browse')} className="hover:text-primary">
          Browse Properties
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span>{property?.title || property?.name}</span>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property?.title || property?.name}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-600">
              <ApperIcon name="MapPin" size={16} />
              <span>{property?.location || property?.address}</span>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-primary">
            {formatPrice(property?.price || property?.estimatedPrice, property?.priceType)}
          </div>
        </div>
        
        <div className="flex gap-2">
<Button
            variant="ghost"
            size="sm"
            icon="Heart"
            onClick={(e) => {
              e.stopPropagation()
              toast.success('Added to favorites!')
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Share"
            onClick={(e) => {
              e.stopPropagation()
              if (navigator.share) {
                navigator.share({ 
                  title: property?.title || property?.name,
                  text: `Check out this property on Match.nz`,
                  url: window.location.href 
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Share link copied to clipboard!')
              }
            }}
          />
        </div>
      </div>

      {/* Images Gallery */}
      <div className="mb-8">
        <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
          {imageLoading[selectedImage] && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <ApperIcon name="Image" size={48} className="text-gray-400" />
            </div>
          )}
          <img 
            src={getImageSrc(images[selectedImage], selectedImage)}
            alt={`${property.title} - Image ${selectedImage + 1}`}
            className={`w-full h-full object-cover ${
              imageLoading[selectedImage] ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => handleImageError(selectedImage)}
            onLoad={() => handleImageLoad(selectedImage)}
          />
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-[4/3] overflow-hidden rounded-lg border-2 relative ${
                  selectedImage === index ? 'border-secondary' : 'border-gray-200'
                }`}
              >
                {imageLoading[index] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <ApperIcon name="Image" size={16} className="text-gray-400" />
                  </div>
                )}
                <img 
                  src={getImageSrc(image, index)}
                  alt={`${property.title} - Thumbnail ${index + 1}`}
                  className={`w-full h-full object-cover ${
                    imageLoading[index] ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Property Features */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Features</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {property?.area && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Square" size={24} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.area}m²</div>
                  <div className="text-sm text-gray-500">Land Area</div>
                </div>
              )}
              
              {property?.floorArea && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Home" size={24} className="text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.floorArea}m²</div>
                  <div className="text-sm text-gray-500">Floor Area</div>
                </div>
              )}
              
              {property?.bedrooms && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Bed" size={24} className="text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
              )}
              
              {property?.bathrooms && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Bath" size={24} className="text-info" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
              )}
              
              {property?.garageSpaces && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Car" size={24} className="text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.garageSpaces}</div>
                  <div className="text-sm text-gray-500">Garage</div>
                </div>
              )}
              
              {property?.lounges && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Sofa" size={24} className="text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.lounges}</div>
                  <div className="text-sm text-gray-500">Living Areas</div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Description */}
          {property?.description && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </Card>
          )}
          
          {/* Features List */}
          {property?.features && property.features.length > 0 && (
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <ApperIcon name="Check" size={16} className="text-success mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enquiry Card */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Interested in this property?
            </h3>
            
            {!showEnquiryForm ? (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowEnquiryForm(true)}
                  className="w-full"
                  icon="MessageCircle"
                >
                  Send Enquiry
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/matches')}
                  className="w-full"
                  icon="Heart"
                >
                  Find Matches
                </Button>
              </div>
            ) : (
<form onSubmit={handleEnquirySubmit} className="space-y-4">
                <Input
                  label="Name"
                  value={enquiryForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={enquiryForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                
<Input
                  label="Phone"
                  type="tel"
                  value={enquiryForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={enquiryForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    placeholder="Tell us about your requirements..."
                    required
                  />
                </div>
                
<div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    icon="Send"
                    loading={enquiryLoading}
                  >
                    Send Enquiry
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowEnquiryForm(false)}
                    icon="X"
                  />
                </div>
              </form>
            )}
          </Card>
          
          {/* Property Info */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Property Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">
                  {propertyType === 'land' ? 'Land' : propertyType === 'concept' ? 'Concept Plan' : 'Showcase Project'}
                </span>
              </div>
              
              {property?.region && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Region</span>
                  <span className="font-medium">{property.region}</span>
                </div>
              )}
              
              {property?.status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={property.status === 'active' ? 'success' : 'warning'}>
                    {property.status}
                  </Badge>
                </div>
              )}
              
              {property?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
          
          {/* Related Properties */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Similar Properties
            </h3>
<div className="text-center text-gray-500 py-8">
              <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="mb-4">Similar properties will appear here</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/browse')}
                icon="ExternalLink"
              >
                Browse All Properties
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage