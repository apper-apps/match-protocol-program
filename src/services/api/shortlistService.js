import shortlistsData from '@/services/mockData/shortlists.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let shortlists = [...shortlistsData]

export const getShortlists = async () => {
  await delay(300)
  return [...shortlists]
}

export const getShortlistById = async (id) => {
  await delay(200)
  
  const shortlist = shortlists.find(s => s.Id === id)
  
  if (!shortlist) {
    throw new Error('Shortlist not found')
  }
  
  return shortlist
}

export const createShortlist = async (shortlistData) => {
  await delay(400)
  
  const newShortlist = {
    Id: Math.max(...shortlists.map(s => s.Id)) + 1,
    userId: 1, // Mock user ID
    ...shortlistData,
    items: shortlistData.items || [],
    sharedWith: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  shortlists.unshift(newShortlist)
  return newShortlist
}

export const updateShortlist = async (id, updateData) => {
  await delay(300)
  
  const shortlistIndex = shortlists.findIndex(s => s.Id === id)
  
  if (shortlistIndex === -1) {
    throw new Error('Shortlist not found')
  }
  
  shortlists[shortlistIndex] = {
    ...shortlists[shortlistIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return shortlists[shortlistIndex]
}

export const deleteShortlist = async (id) => {
  await delay(300)
  
  const shortlistIndex = shortlists.findIndex(s => s.Id === id)
  
  if (shortlistIndex === -1) {
    throw new Error('Shortlist not found')
  }
  
  shortlists.splice(shortlistIndex, 1)
  return true
}

export const addItemToShortlist = async (shortlistId, itemId) => {
  await delay(300)
  
  const shortlistIndex = shortlists.findIndex(s => s.Id === shortlistId)
  
  if (shortlistIndex === -1) {
    throw new Error('Shortlist not found')
  }
  
  const shortlist = shortlists[shortlistIndex]
  
  if (!shortlist.items.includes(itemId)) {
    shortlist.items.push(itemId)
    shortlist.updatedAt = new Date().toISOString()
  }
  
  return shortlist
}

export const removeItemFromShortlist = async (shortlistId, itemId) => {
  await delay(300)
  
  const shortlistIndex = shortlists.findIndex(s => s.Id === shortlistId)
  
  if (shortlistIndex === -1) {
    throw new Error('Shortlist not found')
  }
  
  const shortlist = shortlists[shortlistIndex]
  shortlist.items = shortlist.items.filter(id => id !== itemId)
  shortlist.updatedAt = new Date().toISOString()
  
  return shortlist
}