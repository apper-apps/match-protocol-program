import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const PropertyTypeSwitch = ({ activeType, onTypeChange }) => {
  const types = [
    { value: 'land', label: 'Land', icon: 'MapPin', color: 'primary' },
    { value: 'concept', label: 'Concept Plans', icon: 'Home', color: 'secondary' },
    { value: 'showcase', label: 'Showcase Projects', icon: 'Award', color: 'accent' }
  ]
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-2 inline-flex">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeChange(type.value)}
          className={`
            relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
            ${activeType === type.value 
              ? 'text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {activeType === type.value && (
            <motion.div
              layoutId="activeTypeBackground"
              className={`
                absolute inset-0 rounded-lg
                ${type.color === 'primary' ? 'bg-gradient-to-r from-primary to-secondary' :
                  type.color === 'secondary' ? 'bg-gradient-to-r from-secondary to-green-400' :
                  'bg-gradient-to-r from-accent to-yellow-400'}
              `}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          <div className="relative flex items-center gap-2">
            <ApperIcon name={type.icon} size={18} />
            <span>{type.label}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default PropertyTypeSwitch