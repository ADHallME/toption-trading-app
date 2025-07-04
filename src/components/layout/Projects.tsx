'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const projects = [
  {
    title: 'Solar Panel Installation',
    description: 'A 500MW solar farm providing clean energy to over 100,000 homes.',
    image: 'https://picsum.photos/seed/project1/400/300',
    tags: ['Solar', 'Renewable'],
  },
  {
    title: 'Wind Turbine Farm',
    description: 'Offshore wind farm generating 1.2GW of power, reducing carbon emissions by 2 million tons annually.',
    image: 'https://picsum.photos/seed/project2/400/300',
    tags: ['Wind', 'Offshore'],
  },
  {
    title: 'Geothermal Plant',
    description: 'Harnessing the earth\'s heat to provide a consistent and reliable energy source.',
    image: 'https://picsum.photos/seed/project3/400/300',
    tags: ['Geothermal', 'Sustainable'],
  },
]

export default function Projects() {
  return (
    <section className="bg-[#F0F2F5] py-20">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-gray-800 mb-12"
        >
          Our Projects
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <Image src={project.image} alt={project.title} width={400} height={300} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <a href="#" className="text-gray-800 font-semibold hover:text-gray-900 flex items-center">
                  View Project <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 