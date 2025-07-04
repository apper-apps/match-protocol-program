import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getShortlists, createShortlist, deleteShortlist } from '@/services/api/shortlistService'
import { getSavedSearches, deleteSavedSearch } from '@/services/api/searchService'

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState('shortlists')
  const [shortlists, setShortlists] = useState([])
  const [savedSearches, setSavedSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewShortlist, setShowNewShortlist] = useState(false)
  const [newShortlistName, setNewShortlistName] = useState('')
  const [userProfile, setUserProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+64 21 123 4567',
    location: 'Auckland, New Zealand',
    preferences: {
      notifications: true,
      newsletter: true,
      updates: false
    }
  })
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [shortlistsData, savedSearchesData] = await Promise.all([
        getShortlists(),
        getSavedSearches()
      ])
      
      setShortlists(shortlistsData)
      setSavedSearches(savedSearchesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateShortlist = async (e) => {
    e.preventDefault()
    
    if (!newShortlistName.trim()) {
      toast.error('Please enter a shortlist name')
      return
    }
    
    try {
      const newShortlist = await createShortlist({
        name: newShortlistName,
        items: []
      })
      
      setShortlists(prev => [newShortlist, ...prev])
      setNewShortlistName('')
      setShowNewShortlist(false)
      toast.success('Shortlist created successfully')
    } catch (err) {
      toast.error('Failed to create shortlist')
    }
  }
  
  const handleDeleteShortlist = async (shortlistId) => {
    if (!window.confirm('Are you sure you want to delete this shortlist?')) {
      return
    }
    
    try {
      await deleteShortlist(shortlistId)
      setShortlists(prev => prev.filter(s => s.Id !== shortlistId))
      toast.success('Shortlist deleted successfully')
    } catch (err) {
      toast.error('Failed to delete shortlist')
    }
  }
  
  const handleDeleteSavedSearch = async (searchId) => {
    if (!window.confirm('Are you sure you want to delete this saved search?')) {
      return
    }
    
    try {
      await deleteSavedSearch(searchId)
      setSavedSearches(prev => prev.filter(s => s.Id !== searchId))
      toast.success('Saved search deleted successfully')
    } catch (err) {
      toast.error('Failed to delete saved search')
    }
  }
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    try {
      // In a real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }
  
  const handleUpdatePreferences = async (key, value) => {
    try {
      setUserProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value
        }
      }))
      
      // In a real app, this would update the preferences
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Preferences updated')
    } catch (err) {
      toast.error('Failed to update preferences')
    }
  }
  
  const tabs = [
    { id: 'shortlists', label: 'Shortlists', icon: 'Heart' },
    { id: 'searches', label: 'Saved Searches', icon: 'Search' },
    { id: 'profile', label: 'Profile', icon: 'User' }
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
          title="Failed to load account data"
          message={error}
          onRetry={loadData}
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your properties, searches, and preferences</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Shortlists Tab */}
        {activeTab === 'shortlists' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Shortlists</h2>
              <Button
                variant="primary"
                onClick={() => setShowNewShortlist(true)}
                icon="Plus"
              >
                New Shortlist
              </Button>
            </div>
            
            {/* New Shortlist Form */}
            {showNewShortlist && (
              <Card className="mb-6">
                <form onSubmit={handleCreateShortlist} className="flex gap-4">
                  <Input
                    placeholder="Enter shortlist name..."
                    value={newShortlistName}
                    onChange={(e) => setNewShortlistName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="primary">
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowNewShortlist(false)}
                  >
                    Cancel
                  </Button>
                </form>
              </Card>
            )}
            
            {/* Shortlists List */}
            {shortlists.length === 0 ? (
              <Empty
                title="No shortlists yet"
                message="Create your first shortlist to save and organize your favorite properties"
                icon="Heart"
                actionText="Create Shortlist"
                onAction={() => setShowNewShortlist(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlists.map((shortlist, index) => (
                  <motion.div
                    key={shortlist.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {shortlist.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {shortlist.items?.length || 0} properties
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Share"
                            onClick={() => toast.info('Share functionality coming soon')}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleDeleteShortlist(shortlist.Id)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Created {new Date(shortlist.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Eye"
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Saved Searches Tab */}
        {activeTab === 'searches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Saved Searches</h2>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/browse'}
                icon="Plus"
              >
                New Search
              </Button>
            </div>
            
            {savedSearches.length === 0 ? (
              <Empty
                title="No saved searches"
                message="Save your property searches to get notified when new matching properties become available"
                icon="Search"
                actionText="Start Searching"
                onAction={() => window.location.href = '/browse'}
              />
            ) : (
              <div className="space-y-4">
                {savedSearches.map((search, index) => (
                  <motion.div
                    key={search.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {search.name}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {search.criteria.propertyType && (
                              <Badge variant="primary" size="sm">
                                {search.criteria.propertyType}
                              </Badge>
                            )}
                            {search.criteria.region && (
                              <Badge variant="secondary" size="sm">
                                {search.criteria.region}
                              </Badge>
                            )}
                            {search.criteria.priceRange && (
                              <Badge variant="accent" size="sm">
                                {search.criteria.priceRange}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Created {new Date(search.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              {search.alertsEnabled ? '🔔 Alerts on' : '🔕 Alerts off'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Search"
                            onClick={() => window.location.href = `/browse?${search.queryString}`}
                          >
                            Run Search
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleDeleteSavedSearch(search.Id)}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({...prev, name: e.target.value}))}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({...prev, phone: e.target.value}))}
                    />
                    <Input
                      label="Location"
                      value={userProfile.location}
                      onChange={(e) => setUserProfile(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
                  
                  <Button type="submit" variant="primary">
                    Update Profile
                  </Button>
                </form>
              </Card>
              
              {/* Preferences */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preferences
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive updates about your saved searches</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.preferences.notifications}
                      onChange={(e) => handleUpdatePreferences('notifications', e.target.checked)}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Newsletter</h4>
                      <p className="text-sm text-gray-500">Get weekly property market insights</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.preferences.newsletter}
                      onChange={(e) => handleUpdatePreferences('newsletter', e.target.checked)}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Product Updates</h4>
                      <p className="text-sm text-gray-500">Be notified about new features</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.preferences.updates}
                      onChange={(e) => handleUpdatePreferences('updates', e.target.checked)}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </Card>
              
              {/* Account Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    icon="Download"
                    onClick={() => toast.info('Data export feature coming soon')}
                  >
                    Export My Data
                  </Button>
                  
                  <Button
                    variant="outline"
                    icon="Key"
                    onClick={() => toast.info('Password change feature coming soon')}
                  >
                    Change Password
                  </Button>
                  
                  <Button
                    variant="danger"
                    icon="UserX"
                    onClick={() => toast.error('Account deletion requires contacting support')}
                  >
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAccountPage