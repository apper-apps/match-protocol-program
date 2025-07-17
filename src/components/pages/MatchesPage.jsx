import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import MatchScore from '@/components/molecules/MatchScore'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getMatches, createMatch, deleteMatch } from '@/services/api/matchService'
import { getLandListings, getConceptPlans } from '@/services/api/propertyService'

const MatchesPage = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateMatch, setShowCreateMatch] = useState(false)
  const [landListings, setLandListings] = useState([])
  const [conceptPlans, setConceptPlans] = useState([])
  const [selectedLand, setSelectedLand] = useState('')
  const [selectedConcept, setSelectedConcept] = useState('')
  const [matchNotes, setMatchNotes] = useState('')
  const [creatingMatch, setCreatingMatch] = useState(false)
  
  useEffect(() => {
    loadMatches()
    loadProperties()
  }, [])
  
  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const matchesData = await getMatches()
      setMatches(matchesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const loadProperties = async () => {
    try {
      const [land, concepts] = await Promise.all([
        getLandListings(),
        getConceptPlans()
      ])
      
      setLandListings(land)
      setConceptPlans(concepts)
    } catch (err) {
      console.error('Failed to load properties:', err)
    }
  }
  
  const handleCreateMatch = async (e) => {
    e.preventDefault()
    
    if (!selectedLand || !selectedConcept) {
      toast.error('Please select both land and concept plan')
      return
    }
    
    try {
      setCreatingMatch(true)
      
      const matchData = {
        landListingId: selectedLand,
        conceptPlanId: selectedConcept,
        notes: matchNotes,
        compatibilityScore: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
      }
      
      const newMatch = await createMatch(matchData)
      setMatches(prev => [newMatch, ...prev])
      
      // Reset form
      setSelectedLand('')
      setSelectedConcept('')
      setMatchNotes('')
      setShowCreateMatch(false)
      
      toast.success('Match created successfully!')
    } catch (err) {
      toast.error('Failed to create match')
    } finally {
      setCreatingMatch(false)
    }
  }
  
  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) {
      return
    }
    
    try {
      await deleteMatch(matchId)
      setMatches(prev => prev.filter(match => match.Id !== matchId))
      toast.success('Match deleted successfully')
    } catch (err) {
      toast.error('Failed to delete match')
    }
  }
  
  const handleShareMatch = (match) => {
    const shareUrl = `${window.location.origin}/matches/${match.Id}`
    if (navigator.share) {
      navigator.share({
        title: 'Property Match',
        text: `Check out this property match on Match.nz`,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard')
    }
  }
  
  const calculateCompatibilityScore = (landId, conceptId) => {
    // Simple compatibility calculation based on property features
    const land = landListings.find(l => l.Id === parseInt(landId))
    const concept = conceptPlans.find(c => c.Id === parseInt(conceptId))
    
    if (!land || !concept) return 50
    
    let score = 70 // Base score
    
    // Area compatibility
    if (land.area && concept.floorArea) {
      const ratio = concept.floorArea / land.area
      if (ratio >= 0.2 && ratio <= 0.4) score += 15
      else if (ratio >= 0.1 && ratio <= 0.6) score += 10
      else score += 5
    }
    
    // Price compatibility
    if (land.price && concept.estimatedPrice) {
      const totalCost = land.price + concept.estimatedPrice
      if (totalCost <= 800000) score += 10
      else if (totalCost <= 1200000) score += 5
    }
    
    // Random factor
    score += Math.floor(Math.random() * 10)
    
    return Math.min(score, 100)
  }
  
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
          title="Failed to load matches"
          message={error}
          onRetry={loadMatches}
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
<h1 className="text-3xl font-bold text-gray-900">My Matches</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your property matches with AI-powered results
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowCreateMatch(true)}
          icon="Plus"
        >
          Create New Match
        </Button>
      </div>
      
      {/* Create Match Modal */}
      <AnimatePresence>
        {showCreateMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Match
                  </h2>
                  <button
                    onClick={() => setShowCreateMatch(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateMatch} className="space-y-6">
                  {/* Land Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Land Listing
                    </label>
                    <select
                      value={selectedLand}
                      onChange={(e) => setSelectedLand(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose a land listing...</option>
                      {landListings.map(land => (
                        <option key={land.Id} value={land.Id}>
                          {land.title} - {land.location} ({land.area}m²)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Concept Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Concept Plan
                    </label>
                    <select
                      value={selectedConcept}
                      onChange={(e) => setSelectedConcept(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose a concept plan...</option>
                      {conceptPlans.map(concept => (
                        <option key={concept.Id} value={concept.Id}>
                          {concept.name} - {concept.bedrooms}BR/{concept.bathrooms}BA ({concept.floorArea}m²)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Compatibility Preview */}
                  {selectedLand && selectedConcept && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Compatibility Score
                        </span>
                        <MatchScore 
                          score={calculateCompatibilityScore(selectedLand, selectedConcept)}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={matchNotes}
                      onChange={(e) => setMatchNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Add any notes about this match..."
                    />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={creatingMatch}
                      className="flex-1"
                    >
                      Create Match
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreateMatch(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Matches List */}
      {matches.length === 0 ? (
        <Empty
          title="No matches yet"
          message="Create your first property match to get started"
          icon="Heart"
          actionText="Create Match"
          onAction={() => setShowCreateMatch(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Match Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <MatchScore 
                        score={match.compatibilityScore}
                        size="md"
                        showLabel={false}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Property Match #{match.Id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(match.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Share"
                        onClick={() => handleShareMatch(match)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteMatch(match.Id)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Match Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Land Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ApperIcon name="MapPin" size={20} className="text-primary" />
                        <h4 className="font-semibold text-gray-900">Land</h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Sample Land Listing
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          Auckland, New Zealand
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">
                            $450,000
                          </span>
                          <span className="text-sm text-gray-500">
                            650m²
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Concept Plan Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ApperIcon name="Home" size={20} className="text-secondary" />
                        <h4 className="font-semibold text-gray-900">Concept Plan</h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Modern Family Home
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          4BR/2BA • 180m²
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-secondary">
                            $320,000
                          </span>
                          <span className="text-sm text-gray-500">
                            Est. build
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Match Notes */}
                  {match.notes && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                      <p className="text-sm text-gray-700">{match.notes}</p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      icon="MessageCircle"
                      className="flex-1"
                    >
                      Contact Builder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="ExternalLink"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchesPage