import matchesData from '@/services/mockData/matches.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let matches = [...matchesData]

export const getMatches = async () => {
  await delay(300)
  return [...matches]
}

export const getMatchById = async (id) => {
  await delay(200)
  
  const match = matches.find(m => m.Id === id)
  
  if (!match) {
    throw new Error('Match not found')
  }
  
  return match
}

export const createMatch = async (matchData) => {
  await delay(400)
  
  const newMatch = {
    Id: Math.max(...matches.map(m => m.Id)) + 1,
    userId: 1, // Mock user ID
    ...matchData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  matches.unshift(newMatch)
  return newMatch
}

export const updateMatch = async (id, updateData) => {
  await delay(300)
  
  const matchIndex = matches.findIndex(m => m.Id === id)
  
  if (matchIndex === -1) {
    throw new Error('Match not found')
  }
  
  matches[matchIndex] = {
    ...matches[matchIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return matches[matchIndex]
}

export const deleteMatch = async (id) => {
  await delay(300)
  
  const matchIndex = matches.findIndex(m => m.Id === id)
  
  if (matchIndex === -1) {
    throw new Error('Match not found')
  }
  
  matches.splice(matchIndex, 1)
  return true
}