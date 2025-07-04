import savedSearchesData from '@/services/mockData/savedSearches.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let savedSearches = [...savedSearchesData]

export const getSavedSearches = async () => {
  await delay(300)
  return [...savedSearches]
}

export const getSavedSearchById = async (id) => {
  await delay(200)
  
  const search = savedSearches.find(s => s.Id === id)
  
  if (!search) {
    throw new Error('Saved search not found')
  }
  
  return search
}

export const createSavedSearch = async (searchData) => {
  await delay(400)
  
  const newSearch = {
    Id: Math.max(...savedSearches.map(s => s.Id)) + 1,
    userId: 1, // Mock user ID
    ...searchData,
    alertsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  savedSearches.unshift(newSearch)
  return newSearch
}

export const updateSavedSearch = async (id, updateData) => {
  await delay(300)
  
  const searchIndex = savedSearches.findIndex(s => s.Id === id)
  
  if (searchIndex === -1) {
    throw new Error('Saved search not found')
  }
  
  savedSearches[searchIndex] = {
    ...savedSearches[searchIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return savedSearches[searchIndex]
}

export const deleteSavedSearch = async (id) => {
  await delay(300)
  
  const searchIndex = savedSearches.findIndex(s => s.Id === id)
  
  if (searchIndex === -1) {
    throw new Error('Saved search not found')
  }
  
  savedSearches.splice(searchIndex, 1)
  return true
}