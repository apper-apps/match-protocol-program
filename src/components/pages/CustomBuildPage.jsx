import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getBuilders, submitCustomBuildEnquiry } from '@/services/api/builderService'

const CustomBuildPage = () => {
  const [builders, setBuilders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBuilder, setSelectedBuilder] = useState('')
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    buildType: '',
    budget: '',
    timeline: '',
    landOwned: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    loadBuilders()
  }, [])
  
  const loadBuilders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const buildersData = await getBuilders()
      setBuilders(buildersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field, value) => {
    setEnquiryData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'location', 'buildType', 'budget', 'message']
    const missingFields = requiredFields.filter(field => !enquiryData[field])
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (!selectedBuilder) {
      toast.error('Please select a builder')
      return
    }
    
    try {
      setSubmitting(true)
      
      const enquiry = {
        ...enquiryData,
        builderId: selectedBuilder,
        submittedAt: new Date().toISOString()
      }
      
      await submitCustomBuildEnquiry(enquiry)
      
      toast.success('Enquiry submitted successfully! The builder will contact you soon.')
      
      // Reset form
      setEnquiryData({
        name: '',
        email: '',
        phone: '',
        location: '',
        buildType: '',
        budget: '',
        timeline: '',
        landOwned: '',
        message: ''
      })
      setSelectedBuilder('')
      
    } catch (err) {
      toast.error('Failed to submit enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const buildTypes = [
    { value: 'new-build', label: 'New Build' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'extension', label: 'Extension' },
    { value: 'commercial', label: 'Commercial' }
  ]
  
  const budgetRanges = [
    { value: '200k-400k', label: '$200k - $400k' },
    { value: '400k-600k', label: '$400k - $600k' },
    { value: '600k-800k', label: '$600k - $800k' },
    { value: '800k-1m', label: '$800k - $1M' },
    { value: '1m-plus', label: '$1M+' }
  ]
  
  const timelineOptions = [
    { value: '3-6-months', label: '3-6 months' },
    { value: '6-12-months', label: '6-12 months' },
    { value: '12-18-months', label: '12-18 months' },
    { value: '18-plus-months', label: '18+ months' }
  ]
  
  const landOptions = [
    { value: 'yes', label: 'Yes, I own land' },
    { value: 'no', label: 'No, I need to find land' },
    { value: 'looking', label: 'Currently looking for land' }
  ]
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error
          title="Failed to load builders"
          message={error}
          onRetry={loadBuilders}
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Custom Build Enquiry
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with trusted builders across New Zealand to bring your vision to life
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enquiry Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tell us about your project
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={enquiryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  icon="User"
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={enquiryData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  icon="Mail"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  value={enquiryData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  icon="Phone"
                />
                
                <Input
                  label="Location"
                  value={enquiryData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  icon="MapPin"
                  placeholder="City or region"
                />
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Build Type"
                  options={buildTypes}
                  value={enquiryData.buildType}
                  onChange={(e) => handleInputChange('buildType', e.target.value)}
                  required
                />
                
                <Select
                  label="Budget Range"
                  options={budgetRanges}
                  value={enquiryData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Timeline"
                  options={timelineOptions}
                  value={enquiryData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                />
                
                <Select
                  label="Do you own land?"
                  options={landOptions}
                  value={enquiryData.landOwned}
                  onChange={(e) => handleInputChange('landOwned', e.target.value)}
                />
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={enquiryData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  placeholder="Tell us about your project requirements, style preferences, and any specific needs..."
                  required
                />
              </div>
              
              {/* Builder Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Builder *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {builders.map((builder) => (
                    <div
                      key={builder.Id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedBuilder === builder.Id.toString()
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBuilder(builder.Id.toString())}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{builder.name}</h3>
                        <Badge variant="secondary" size="sm">
                          {builder.region}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{builder.specialty}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Star" size={16} className="mr-1 text-yellow-500" />
                        <span>{builder.rating}/5</span>
                        <span className="mx-2">•</span>
                        <span>{builder.projectsCompleted} projects</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                icon="Send"
                className="w-full"
              >
                Submit Enquiry
              </Button>
            </form>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Process Steps */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              How it works
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Submit Enquiry</h4>
                  <p className="text-sm text-gray-600">Tell us about your project requirements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Builder Contact</h4>
                  <p className="text-sm text-gray-600">Your selected builder will contact you within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Project Planning</h4>
                  <p className="text-sm text-gray-600">Work together to plan your perfect build</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Why Choose Us */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Why choose Match.nz?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ApperIcon name="Shield" size={20} className="text-primary" />
                <span className="text-sm text-gray-700">Vetted and trusted builders</span>
              </div>
              
              <div className="flex items-center gap-3">
                <ApperIcon name="Star" size={20} className="text-primary" />
                <span className="text-sm text-gray-700">Rated by real customers</span>
              </div>
              
              <div className="flex items-center gap-3">
                <ApperIcon name="MapPin" size={20} className="text-primary" />
                <span className="text-sm text-gray-700">Local expertise nationwide</span>
              </div>
              
              <div className="flex items-center gap-3">
                <ApperIcon name="Clock" size={20} className="text-primary" />
                <span className="text-sm text-gray-700">Fast response times</span>
              </div>
            </div>
          </Card>
          
          {/* Contact Support */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our team is here to help you find the perfect builder for your project.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="Phone" size={16} className="text-primary" />
                <span className="text-sm text-gray-700">0800 MATCH NZ</span>
              </div>
              
              <div className="flex items-center gap-3">
                <ApperIcon name="Mail" size={16} className="text-primary" />
                <span className="text-sm text-gray-700">hello@match.nz</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomBuildPage