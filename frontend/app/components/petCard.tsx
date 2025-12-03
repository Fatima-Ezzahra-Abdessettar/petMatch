import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { useTheme } from '~/contexts/themeContext';


interface PetCardProps {
  props: {
    id: string | number;
    name: string;
    profile_picture: string;
    age: string | number;
    breed: string;
    description: string;
  };
}

export default function PetCard({ props }: PetCardProps) {
    const { isDarkMode } = useTheme();


  return (
        <div
        className="hover:cursor-pointer relative p-4 mb-4 flex flex-col items-center rounded-xl xl:rounded-2xl w-70 h-100 bg-cover bg-center transition-shadow duration-300"
        style={{ 
          backgroundImage: `url(${encodeURI(props.profile_picture)})`,
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)' 
            : '0 20px 25px -5px rgba(163, 163, 163, 0.4), 0 8px 10px -6px rgba(163, 163, 163, 0.4)'
        }}
        key={props.id}
        >
        <div 
          className="absolute bottom-0 left-0 w-70 backdrop-blur-xs pt-3 px-3 pb-10 text-start xl:rounded-b-2xl rounded-b-xl flex flex-col gap-4 transition-colors duration-300"
          style={{
            backgroundColor: isDarkMode ? 'rgba(54, 51, 46, 0.85)' : 'rgba(255, 255, 255, 0.8)'
          }}
        >
            <div>
                <h2 
                  className="font-playfair text-xl transition-colors duration-300"
                  style={{ color: isDarkMode ? '#F5F3ED' : '#36332E' }}
                >
                  {props.name}
                </h2>
                <div 
                  className="font-raleway text-sm flex gap-2 font-extralight transition-colors duration-300"
                  style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
                >
                  <p>{props.breed} - </p>
                  <p>{props.age} years old </p>
                </div>
            </div>
            <p 
              className="font-light text-sm w-60 truncate transition-colors duration-300"
              style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
            >
              {props.description}
            </p>
        </div>
        </div>
  )
}