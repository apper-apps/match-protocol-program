import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import PropertyTypeSwitch from '@/components/molecules/PropertyTypeSwitch'
import ApperIcon from '@/components/ApperIcon'

const HeroSection = () => {
  const [activeType, setActiveType] = useState('land')
  const navigate = useNavigate()
  
  const handleSearch = (searchTerm) => {
    navigate(`/browse?search=${encodeURIComponent(searchTerm)}&type=${activeType}`)
  }
  
  const handleBrowseAll = () => {
    navigate('/browse')
  }
  
  const handleCustomBuild = () => {
    navigate('/custom-build')
  }
  
  const stats = [
    { value: '5,000+', label: 'Land Listings', icon: 'MapPin' },
    { value: '200+', label: 'Concept Plans', icon: 'Home' },
    { value: '50+', label: 'Showcase Projects', icon: 'Award' },
    { value: '30+', label: 'Trusted Builders', icon: 'Users' }
  ]
  
  return (
<section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                House & Land Match
              </span>
            </h1>
            
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Connect premium New Zealand land listings with stunning home concept plans. 
              Discover your dream property and get matched with trusted local builders.
            </p>
          </motion.div>
          
          {/* Property Type Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <PropertyTypeSwitch 
              activeType={activeType} 
              onTypeChange={setActiveType} 
            />
          </motion.div>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <SearchBar 
              onSearch={handleSearch}
              placeholder={`Search ${activeType === 'land' ? 'land listings' : activeType === 'concept' ? 'concept plans' : 'showcase projects'}...`}
            />
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={handleBrowseAll}
              icon="Search"
            >
              Browse All Properties
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCustomBuild}
              icon="Hammer"
            >
              Start Custom Build
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} size={32} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection