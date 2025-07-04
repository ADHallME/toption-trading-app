'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Facebook, Twitter, Instagram } from 'lucide-react'

const navLinks = [
  { name: 'Projects', href: '/projects' },
  { name: 'News', href: '/news' },
  { name: 'Campaigns', href: '/campaigns' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          GreenHarbor
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center">
          <ul className="flex items-center space-x-2 bg-white/50 backdrop-blur-md rounded-full p-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center space-x-2">
           <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md rounded-full p-2">
                <Link href="#" className="p-2 rounded-full hover:bg-white/70">
                    <Facebook size={18} />
                </Link>
                <Link href="#" className="p-2 rounded-full hover:bg-white/70">
                    <Twitter size={18} />
                </Link>
                <Link href="#" className="p-2 rounded-full hover:bg-white/70">
                    <Instagram size={18} />
                </Link>
           </div>
          <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors">
            Take the Quiz
            <span className="ml-2 bg-gray-700 rounded-full p-1">
              <Plus size={16} />
            </span>
          </button>
        </div>
        
        {/* Mobile menu button (functionality to be added) */}
        <div className="md:hidden">
          <button className="text-gray-800">
            {/* Replace with a menu icon */}
            Menu
          </button>
        </div>
      </div>
    </header>
  )
} 