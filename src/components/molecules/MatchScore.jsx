import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MatchScore = ({ score, size = 'md', showLabel = true }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (score >= 75) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-orange-400'
    if (score >= 40) return 'bg-gradient-to-r from-orange-400 to-red-400'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }
  
  const getScoreText = (score) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 75) return 'Great Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Poor Match'
  }
  
  const sizes = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  }
  
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className={`
          ${sizes[size]} ${getScoreColor(score)}
          rounded-full flex items-center justify-center text-white font-bold
          shadow-lg relative overflow-hidden
        `}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-white opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative flex items-center">
          <ApperIcon name="Heart" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="mr-1" />
          {score}%
        </div>
      </motion.div>
      
      {showLabel && (
        <div>
          <div className="font-semibold text-gray-900">{getScoreText(score)}</div>
          <div className="text-sm text-gray-500">Compatibility Score</div>
        </div>
      )}
    </div>
  )
}

export default MatchScore