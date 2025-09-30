'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Toption. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
