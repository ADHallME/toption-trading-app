'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const videoUrl = "https://cdn.dribbble.com/userupload/12955015/file/original-923f007722e932199c731cb88163f021.mp4"

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
         <video 
          src={videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-[#F0F2F5] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#F0F2F5] z-10 h-1/4" />

      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
          >
            Join the Green Revolution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-lg mb-8"
          >
            Take charge of our planet's future! Join the Green Revolution by planting a tree today. Every tree counts in our mission for a greener, healthier world.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Learn More
            <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </div>

      {/* Floating Cards */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-16 left-16 z-30"
      >
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 flex items-center space-x-4 max-w-sm shadow-lg">
           <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
             <Image src="https://picsum.photos/seed/fern/96/96" alt="Ferns" width={96} height={96} className="w-full h-full object-cover"/>
           </div>
           <div>
            <h3 className="font-bold text-gray-800">International Environment Day</h3>
           </div>
           <div className="p-2 bg-white/50 rounded-full">
            <ArrowRight size={20} className="text-gray-700"/>
           </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-16 right-16 z-30"
      >
        <div className="bg-gray-800 text-white rounded-2xl p-6 max-w-xs shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold">+1 Million Trees Planted</h3>
            <div className="bg-gray-700 rounded-full p-1">
              <Plus size={16} />
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            GreenHarbor has successfully planted over 1 million trees worldwide.
          </p>
          <div className="flex space-x-2">
            <div className="w-full h-1 bg-gray-700 rounded-full"><div className="w-1/3 h-1 bg-white rounded-full"></div></div>
            <div className="w-full h-1 bg-gray-700 rounded-full"></div>
            <div className="w-full h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 