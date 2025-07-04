import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getPropertyById } from '@/services/api/propertyService'

const PropertyDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  useEffect(() => {
    loadProperty()
  }, [id])
  
  const loadProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const propertyData = await getPropertyById(parseInt(id))
      setProperty(propertyData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEnquirySubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!enquiryData.name || !enquiryData.email || !enquiryData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    
    try {
      // In a real app, this would send the enquiry to the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Enquiry sent successfully! We\'ll be in touch soon.')
      setShowEnquiryForm(false)
      setEnquiryData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      toast.error('Failed to send enquiry. Please try again.')
    }
  }
  
  const handleInputChange = (field, value) => {
    setEnquiryData(prev => ({ ...prev, [field]: value }))
  }
  
  const formatPrice = (price, priceType) => {
    if (priceType === 'poa') return 'POA'
    if (priceType === 'auction') return 'Auction'
    if (!price) return 'Price on application'
    return `$${price.toLocaleString()}`
  }
  
  const getPropertyType = () => {
    if (property?.type) return property.type
    if (property?.area && !property?.bedrooms) return 'land'
    if (property?.floorArea && property?.bedrooms) return 'concept'
    return 'showcase'
  }
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="detail" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error
          title="Property not found"
          message={error}
          onRetry={loadProperty}
        />
      </div>
    )
  }
  
  const propertyType = getPropertyType()
  const images = property?.images || ['/api/placeholder/800/600']
  
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge 
              variant={propertyType === 'land' ? 'primary' : propertyType === 'concept' ? 'secondary' : 'accent'}
              icon={propertyType === 'land' ? 'MapPin' : propertyType === 'concept' ? 'Home' : 'Award'}
            >
              {propertyType === 'land' ? 'Land' : propertyType === 'concept' ? 'Concept Plan' : 'Showcase Project'}
            </Badge>
            {property?.region && (
              <Badge variant="default">
                {property.region}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property?.title || property?.name}
          </h1>
          
          {property?.location && (
            <div className="flex items-center text-gray-600 mb-4">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              <span>{property.location}</span>
            </div>
          )}
          
          <div className="text-3xl font-bold text-primary">
            {formatPrice(property?.price || property?.estimatedPrice, property?.priceType)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Heart"
            onClick={() => toast.success('Added to favorites')}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Share"
            onClick={() => navigator.share?.({ url: window.location.href }) || toast.info('Share link copied')}
          />
        </div>
      </div>
      
      {/* Images Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Main Image */}
        <div className="relative">
          <img
            src={images[selectedImage]}
            alt={property?.title || property?.name}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
          
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)}
              className={`relative h-44 rounded-xl overflow-hidden ${
                selectedImage === index + 1 ? 'ring-4 ring-primary' : ''
              }`}
            >
              <img
                src={image}
                alt={`Property image ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
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
                  value={enquiryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={enquiryData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                
                <Input
                  label="Phone"
                  type="tel"
                  value={enquiryData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={enquiryData.message}
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
              <p>Similar properties will appear here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage