'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Leaf, Shield, Users, Target, Award, Globe } from 'lucide-react'

export default function Sustainability() {
  const commitments = [
    {
      icon: Leaf,
      title: 'Environmental Stewardship',
      description: 'We are committed to minimizing our environmental footprint and promoting biodiversity in all our projects.',
      details: [
        'Zero waste to landfill by 2030',
        '100% renewable energy for our operations',
        'Carbon neutral by 2025',
        'Biodiversity protection in all project sites'
      ]
    },
    {
      icon: Shield,
      title: 'Health and Safety',
      description: 'The safety and well-being of our employees, contractors, and communities is our highest priority.',
      details: [
        'Zero harm safety culture',
        'Comprehensive safety training programs',
        'Regular safety audits and inspections',
        'Emergency response protocols'
      ]
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'We believe in building strong, lasting relationships with the communities where we operate.',
      details: [
        'Local hiring and training programs',
        'Community investment initiatives',
        'Transparent communication and consultation',
        'Support for local businesses and suppliers'
      ]
    },
    {
      icon: Target,
      title: 'Sustainable Development',
      description: 'Our projects are designed to create long-term value while protecting natural resources.',
      details: [
        'Lifecycle assessment for all projects',
        'Sustainable materials and construction methods',
        'Energy efficiency optimization',
        'Circular economy principles'
      ]
    }
  ]

  const achievements = [
    { number: '2.5M', label: 'Tons of CO2 Avoided Annually', icon: Award },
    { number: '100%', label: 'Renewable Energy Projects', icon: Globe },
    { number: '50+', label: 'Communities Supported', icon: Users },
    { number: '0', label: 'Safety Incidents in 2024', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/1920/1080?random=10"
            alt="Sustainable Energy"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-green-900/60" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Our Commitments
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            We are committed to creating a sustainable future through responsible 
            energy development, environmental stewardship, and community partnership.
          </p>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Building a Sustainable Future
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Virtera Energy, we believe that sustainable energy development is not just 
              about generating clean power—it's about creating lasting positive impact for 
              communities, protecting our environment, and building a resilient energy 
              infrastructure for future generations. Our comprehensive approach integrates 
              environmental responsibility, social equity, and economic viability into every 
              project we undertake.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commitments Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Commitments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every action we take.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commitments.map((commitment, index) => (
              <motion.div
                key={commitment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-center mb-6">
                  <commitment.icon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">{commitment.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{commitment.description}</p>
                <ul className="space-y-2">
                  {commitment.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health and Safety Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Health and Safety</h2>
              <p className="text-xl text-gray-600 mb-6">
                The safety and well-being of our employees, contractors, and the communities 
                where we operate is our highest priority. We maintain the highest standards 
                of health and safety across all our operations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive safety program includes rigorous training, regular audits, 
                and continuous improvement processes to ensure we maintain our zero-harm 
                safety culture. We believe that every incident is preventable, and we work 
                tirelessly to create safe working environments for everyone involved in our projects.
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Standards</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• ISO 45001 Occupational Health and Safety Management</li>
                  <li>• Regular safety training and certification programs</li>
                  <li>• Comprehensive risk assessment and mitigation</li>
                  <li>• Emergency response and crisis management protocols</li>
                </ul>
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
                src="https://picsum.photos/600/400?random=11"
                alt="Safety Training"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable results that demonstrate our commitment to sustainability and safety.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <achievement.icon className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <div className="text-gray-600 text-sm">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Us in Building a Sustainable Future
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Together, we can create a world powered by clean, renewable energy that 
              benefits everyone while protecting our planet for future generations.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Learn More About Our Projects
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 