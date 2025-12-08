import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/auth';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { motion } from 'framer-motion';

export default function WelcomeUser() {
  const { user } = useAuth();

  return (
    <AuthenticatedLayout>
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/catDog.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Blur overlay */}
        <div 
          className="absolute inset-0 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-5xl md:text-7xl font-playfair text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Welcome to petMatch
            </h1>
            <p className="text-xl md:text-2xl font-raleway text-white mb-8">
              ready to meet you new companion ?
            </p>
            <Link to="/our-pets">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg text-lg font-medium hover:bg-orange-700 transition-colors"
                style={{ backgroundColor: '#D97F3E' }}
              >
                browse pets
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

