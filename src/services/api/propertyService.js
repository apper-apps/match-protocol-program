import landListingsData from '@/services/mockData/landListings.json'
import conceptPlansData from '@/services/mockData/conceptPlans.json'
import showcaseProjectsData from '@/services/mockData/showcaseProjects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getLandListings = async () => {
  await delay(300)
  return [...landListingsData]
}

export const getConceptPlans = async () => {
  await delay(300)
  return [...conceptPlansData]
}

export const getShowcaseProjects = async () => {
  await delay(300)
  return [...showcaseProjectsData]
}

export const getPropertyById = async (id) => {
  await delay(200)
  
  const allProperties = [
    ...landListingsData.map(p => ({ ...p, type: 'land' })),
    ...conceptPlansData.map(p => ({ ...p, type: 'concept' })),
    ...showcaseProjectsData.map(p => ({ ...p, type: 'showcase' }))
  ]
  
  const property = allProperties.find(p => p.Id === id)
  
  if (!property) {
    throw new Error('Property not found')
  }
  
  return property
}

export const searchProperties = async (criteria) => {
  await delay(400)
  
  const allProperties = [
    ...landListingsData.map(p => ({ ...p, type: 'land' })),
    ...conceptPlansData.map(p => ({ ...p, type: 'concept' })),
    ...showcaseProjectsData.map(p => ({ ...p, type: 'showcase' }))
  ]
  
  let filtered = allProperties
  
  if (criteria.search) {
    const searchLower = criteria.search.toLowerCase()
    filtered = filtered.filter(p => 
      (p.title || p.name || '').toLowerCase().includes(searchLower) ||
      (p.location || '').toLowerCase().includes(searchLower) ||
      (p.description || '').toLowerCase().includes(searchLower)
    )
  }
  
  if (criteria.type && criteria.type !== 'all') {
    filtered = filtered.filter(p => p.type === criteria.type)
  }
  
  if (criteria.region) {
    filtered = filtered.filter(p => 
      p.region && p.region.toLowerCase().includes(criteria.region.toLowerCase())
    )
  }
  
  if (criteria.minPrice) {
    filtered = filtered.filter(p => 
      (p.price || p.estimatedPrice || 0) >= criteria.minPrice
    )
  }
  
  if (criteria.maxPrice) {
    filtered = filtered.filter(p => 
      (p.price || p.estimatedPrice || 0) <= criteria.maxPrice
    )
  }
  
  return filtered
}