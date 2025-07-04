'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Calendar, Users, Zap, ArrowRight, ExternalLink } from 'lucide-react'

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(0)

  const projects = [
    {
      id: 1,
      name: 'Sun Valley Solar Farm',
      location: 'Arizona, USA',
      type: 'Solar Energy',
      capacity: '150 MW',
      status: 'Operational',
      completion: '2023',
      description: 'A state-of-the-art solar farm providing clean energy to over 30,000 homes while supporting local wildlife conservation efforts.',
      image: 'https://picsum.photos/600/400?random=12',
      details: {
        'Annual Output': '280 GWh',
        'CO2 Avoided': '125,000 tons/year',
        'Local Jobs': '45 permanent positions',
        'Community Investment': '$2.5M'
      }
    },
    {
      id: 2,
      name: 'Wind Ridge Project',
      location: 'Texas, USA',
      type: 'Wind Energy',
      capacity: '200 MW',
      status: 'Under Construction',
      completion: '2024',
      description: 'Advanced wind farm utilizing cutting-edge turbine technology to maximize energy production in optimal wind conditions.',
      image: 'https://picsum.photos/600/400?random=13',
      details: {
        'Annual Output': '650 GWh',
        'CO2 Avoided': '300,000 tons/year',
        'Local Jobs': '60 permanent positions',
        'Community Investment': '$3.2M'
      }
    },
    {
      id: 3,
      name: 'Green Harbor Offshore',
      location: 'California Coast',
      type: 'Offshore Wind',
      capacity: '500 MW',
      status: 'Planning Phase',
      completion: '2026',
      description: 'Revolutionary offshore wind project that will be the largest of its kind on the West Coast, powering over 200,000 homes.',
      image: 'https://picsum.photos/600/400?random=14',
      details: {
        'Annual Output': '1,800 GWh',
        'CO2 Avoided': '850,000 tons/year',
        'Local Jobs': '120 permanent positions',
        'Community Investment': '$8.5M'
      }
    },
    {
      id: 4,
      name: 'Hydro Valley Storage',
      location: 'Oregon, USA',
      type: 'Pumped Hydro Storage',
      capacity: '100 MW',
      status: 'Feasibility Study',
      completion: '2027',
      description: 'Innovative pumped hydro storage facility that will provide grid stability and energy storage for renewable integration.',
      image: 'https://picsum.photos/600/400?random=15',
      details: {
        'Storage Capacity': '800 MWh',
        'Grid Stability': '24/7 support',
        'Local Jobs': '35 permanent positions',
        'Community Investment': '$1.8M'
      }
    }
  ]

  const projectTypes = ['All Projects', 'Solar', 'Wind', 'Offshore Wind', 'Storage']

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/1920/1080?random=16"
            alt="Portfolio Projects"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Expanding Horizons
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Discover our portfolio of innovative renewable energy projects 
            that are transforming communities and powering the future.
          </p>
        </motion.div>
      </section>

      {/* Project Filter */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {projectTypes.map((type, index) => (
              <button
                key={type}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                {type}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Project</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our flagship Green Harbor Offshore Wind Project represents the future 
              of renewable energy on the West Coast.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Green Harbor Offshore</h3>
                <p className="text-lg text-gray-600 mb-6">
                  This revolutionary offshore wind project will be the largest of its kind 
                  on the West Coast, featuring cutting-edge floating turbine technology 
                  and comprehensive environmental protection measures.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">500 MW</div>
                    <div className="text-sm text-gray-600">Capacity</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">200K+</div>
                    <div className="text-sm text-gray-600">Homes Powered</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">850K</div>
                    <div className="text-sm text-gray-600">Tons CO2 Avoided</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">2026</div>
                    <div className="text-sm text-gray-600">Completion</div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Project Details
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="https://picsum.photos/600/400?random=17"
                alt="Green Harbor Offshore Project"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Project Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse portfolio of renewable energy projects across the United States.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Operational' ? 'bg-green-100 text-green-800' :
                      project.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'Planning Phase' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-blue-600">{project.type}</span>
                    <span className="text-sm font-medium text-gray-600">{project.capacity}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(project.details).slice(0, 2).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm text-gray-500">{key}</div>
                        <div className="font-medium text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you develop sustainable energy solutions 
              that benefit your community and our planet.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start a Conversation
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 