import buildersData from '@/services/mockData/builders.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getBuilders = async () => {
  await delay(300)
  return [...buildersData]
}

export const getBuilderById = async (id) => {
  await delay(200)
  
  const builder = buildersData.find(b => b.Id === id)
  
  if (!builder) {
    throw new Error('Builder not found')
  }
  
  return builder
}

export const getBuildersByRegion = async (region) => {
  await delay(200)
  
  return buildersData.filter(b => 
    b.region.toLowerCase() === region.toLowerCase()
  )
}

export const submitCustomBuildEnquiry = async (enquiryData) => {
  await delay(500)
  
  // In a real app, this would send the enquiry to the backend
  // For now, we'll just simulate success
  
  console.log('Custom build enquiry submitted:', enquiryData)
  
  return {
    success: true,
    message: 'Enquiry submitted successfully',
    enquiryId: Math.floor(Math.random() * 10000)
  }
}