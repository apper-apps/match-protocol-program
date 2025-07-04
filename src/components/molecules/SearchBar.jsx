import { useState } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search properties...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }
  
  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          className="ml-2"
          icon="Search"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

export default SearchBar