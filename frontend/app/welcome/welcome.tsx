import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router'
import { useTheme } from '~/contexts/themeContext';

export default function Welcome() {
  const { isDarkMode } = useTheme();
  return (
    <div>
      <main>
      <div className="flex mt-4 sm:mt-6 md:mt-10 flex-col-reverse md:flex-row gap-8 items-center justify-center mb-10 w-full px-4">
      <motion.div
        className="flex flex-col justify-center items-center md:items-start flex-1"
        initial={{ opacity: 0, x: -60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
       <div className='flex flex-col gap-3'>
         <motion.div
          className="font-playfair text-center md:text-left 
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl transition-colors duration-300"
          style={{ color: isDarkMode ? '#F5F3ED' : '#36332E' }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 80 }}
        >
          Perfect pet companion
        </motion.div>
        <motion.div
          className="font-raleway mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-center md:text-left transition-colors duration-300"
          style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, type: 'spring', stiffness: 80 }}
        >
          Connect with loving animals from trusted shelters worldwide
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 justify-center md:justify-start w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 80 }}
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto bg-btnPrimary px-4 lg:px-12 xl:px-14 py-2 text-BgLight text-base sm:text-lg rounded-lg hover:bg-[#cb763a] hover:transition-colors active:bg-[#b26228] hover:cursor-pointer transition-all duration-200">
             GET STARTED !
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 80 }}
            className="w-full sm:w-auto"
          >
            <Link to={'/our-pets'}>
              <button 
                className="w-full sm:w-auto active:translate-z-2 px-4 lg:px-12 xl:px-14 py-2 border-1 border-btnPrimary text-btnPrimary text-base sm:text-lg rounded-lg hover:cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: isDarkMode ? '#36332E' : '#F7F5EA',
                  boxShadow: isDarkMode 
                    ? '0 10px 15px -3px rgba(217, 127, 62, 0.3), 0 4px 6px -4px rgba(217, 127, 62, 0.3)' 
                    : '0 10px 15px -3px rgba(255, 237, 213, 0.5), 0 4px 6px -4px rgba(255, 237, 213, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 20px 25px -5px rgba(217, 127, 62, 0.5), 0 8px 10px -6px rgba(217, 127, 62, 0.5)'
                    : '0 20px 25px -5px rgba(255, 237, 213, 0.8), 0 8px 10px -6px rgba(255, 237, 213, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 10px 15px -3px rgba(217, 127, 62, 0.3), 0 4px 6px -4px rgba(217, 127, 62, 0.3)'
                    : '0 10px 15px -3px rgba(255, 237, 213, 0.5), 0 4px 6px -4px rgba(255, 237, 213, 0.5)';
                }}
              >
                browse pets
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
      </motion.div>
      <motion.div
        className="flex-1 flex justify-center items-center w-full"
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.img
          src="public/catDog.png"
          alt="petMatch"
          className="w-130 sm:w-140 lg:w-150 xl:w-[90rem] h-auto transition-all duration-300"
          style={{
            filter: isDarkMode ? 'drop-shadow(0 25px 50px rgba(217, 127, 62, 0.3))' : 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, type: 'spring', stiffness: 80 }}
        />
      </motion.div>
    </div>
    </main>
    <section id='about'>
      <div 
        className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair text-center mt-10 sm:mt-20 md:mt-30 mx-2 sm:mx-8 transition-colors duration-300'
        style={{ color: isDarkMode ? '#F5F3ED' : '#36332E' }}
      >
        About us
      </div>
      <div className='flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mt-5 sm:mt-10 mb-20 px-4 sm:px-8 md:px-0'>
        <img 
          src="public/AboutUsimg.png" 
          alt="about us"  
          className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto transition-all duration-300"
          style={{
            // Use  filter drop-shadow to ensure a solid black shadow in dark mode
            filter: isDarkMode ? 'drop-shadow(0 20px 40px rgba(0, 0, 0, 1))' : 'none',
          }}
        />        
        <div 
          className='font-raleway text-lg sm:text-xl lg:text-2xl min-w-90 sm:min-w-100 text-center md:text-left transition-colors duration-300'
          style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
        >
          At Pet Match, we believe every pet deserves a loving home and every family deserves the perfect companion. <br/>
          Our advanced matching algorithm considers personality, lifestyle, living situation, and preferences to create meaningful connections.
        </div>
      </div>
    </section>
    </div>
  )
}