'use client'

import { motion } from 'framer-motion'

const partners = [
  { name: 'EcoCorp', logo: 'https://picsum.photos/seed/logo1/150/50' },
  { name: 'GreenWave', logo: 'https://picsum.photos/seed/logo2/150/50' },
  { name: 'NatureServe', logo: 'https://picsum.photos/seed/logo3/150/50' },
  { name: 'EnviroCo', logo: 'https://picsum.photos/seed/logo4/150/50' },
  { name: 'BioSphere Inc.', logo: 'https://picsum.photos/seed/logo5/150/50' },
  { name: 'TerraFirm', logo: 'https://picsum.photos/seed/logo6/150/50' },
]

export default function Partners() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-sm font-bold uppercase text-gray-500 mb-8"
        >
          Trusted by the world's leading energy companies
        </motion.h2>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={partner.logo} alt={partner.name} className="h-8 md:h-10 object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 