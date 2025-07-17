import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import HeroSection from '@/components/organisms/HeroSection'
import PropertyCard from '@/components/molecules/PropertyCard'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getLandListings, getConceptPlans, getShowcaseProjects } from '@/services/api/propertyService'

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    loadFeaturedProperties()
  }, [])
  
  const loadFeaturedProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [landListings, conceptPlans, showcaseProjects] = await Promise.all([
        getLandListings(),
        getConceptPlans(),
        getShowcaseProjects()
      ])
      
      // Get featured properties (first 3 from each category)
      const featured = [
        ...landListings.slice(0, 3).map(p => ({ ...p, type: 'land' })),
        ...conceptPlans.slice(0, 3).map(p => ({ ...p, type: 'concept' })),
        ...showcaseProjects.slice(0, 3).map(p => ({ ...p, type: 'showcase' }))
      ]
      
      setFeaturedProperties(featured)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const features = [
    {
      icon: 'Search',
      title: 'Smart Property Search',
      description: 'Find the perfect land, concept plans, or showcase projects with our advanced search and filtering system.',
      color: 'primary'
    },
    {
      icon: 'Heart',
      title: 'AI-Powered Matching',
      description: 'Our intelligent matching system suggests compatible land and home combinations based on your preferences.',
      color: 'secondary'
    },
    {
      icon: 'Hammer',
      title: 'Vetted Builder Network',
      description: 'Connect with trusted regional builders who can turn your vision into reality with quality craftsmanship.',
      color: 'accent'
    },
    {
      icon: 'Award',
      title: 'Showcase Gallery',
      description: 'Get inspired by real completed projects from our network of premium builders across New Zealand.',
      color: 'info'
    }
  ]
  
  const regions = [
    { name: 'Auckland', properties: 1250, image: '/api/placeholder/300/200' },
    { name: 'Waikato', properties: 820, image: '/api/placeholder/300/200' },
    { name: 'Bay of Plenty', properties: 650, image: '/api/placeholder/300/200' },
    { name: 'Wellington', properties: 480, image: '/api/placeholder/300/200' },
    { name: 'Canterbury', properties: 920, image: '/api/placeholder/300/200' },
    { name: 'Otago', properties: 380, image: '/api/placeholder/300/200' }
  ]
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium listings, innovative designs, and stunning completed projects
          </p>
        </div>
        
        {loading ? (
          <Loading type="grid" />
        ) : error ? (
          <Error 
            title="Failed to load featured properties"
            message={error}
            onRetry={loadFeaturedProperties}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard 
                  property={property} 
                  type={property.type}
                  showMatchScore={false}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/browse')}
            icon="ArrowRight"
          >
            View All Properties
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Match.nz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've revolutionized the way New Zealanders find and build their dream homes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    feature.color === 'primary' ? 'bg-gradient-to-br from-primary to-secondary' :
                    feature.color === 'secondary' ? 'bg-gradient-to-br from-secondary to-green-400' :
                    feature.color === 'accent' ? 'bg-gradient-to-br from-accent to-yellow-400' :
                    'bg-gradient-to-br from-info to-blue-400'
                  }`}>
                    <ApperIcon name={feature.icon} size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Regions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Region
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover properties across New Zealand's most sought-after regions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card 
                className="overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/browse?region=${region.name.toLowerCase().replace(' ', '-')}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {region.name}
                        </h3>
                        <p className="text-gray-200">
                          {region.properties.toLocaleString()} properties
                        </p>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                        <ApperIcon name="ArrowRight" size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Join thousands of New Zealanders who have found their dream properties through Match.nz
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/browse')}
                icon="Search"
              >
                Start Browsing
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/custom-build')}
                icon="Hammer"
              >
                Custom Build Enquiry
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage