import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const footerSections = [
    {
      title: 'Browse',
      links: [
        { label: 'Land Listings', href: '/browse?type=land' },
        { label: 'Concept Plans', href: '/browse?type=concept' },
        { label: 'Showcase Projects', href: '/browse?type=showcase' },
        { label: 'All Properties', href: '/browse' }
      ]
    },
    {
      title: 'Build',
      links: [
        { label: 'Custom Build', href: '/custom-build' },
        { label: 'Find a Builder', href: '/custom-build#builders' },
        { label: 'Get a Quote', href: '/custom-build#quote' },
        { label: 'Building Guide', href: '/guides/building' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'How It Works', href: '/guides/how-it-works' },
        { label: 'Building Tips', href: '/guides/tips' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Case Studies', href: '/case-studies' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ]
    }
  ]
  
  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' }
  ]
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Home" size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Match.nz
                  </h3>
                  <p className="text-sm text-gray-400">House & Land Match</p>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                New Zealand's leading platform for matching premium land listings with stunning home concept plans. 
                Connect with vetted local builders and turn your dream home into reality.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <ApperIcon name={social.icon} size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-400 mb-6">Get notified about new listings and building insights</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="primary" icon="Send">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Match.nz. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer