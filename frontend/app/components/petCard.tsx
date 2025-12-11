// src/components/PetCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '~/contexts/themeContext';
import { Link } from 'react-router-dom';

interface PetCardProps {
  props: {
    id: number;
    name: string;
    species: string | null;
    type: string | null;
    age: number | null;
    gender: string;
    profile_picture: string | null;
    status: string;
    description: string;
  };
}

export default function PetCard({ props }: PetCardProps) {
  const { isDarkMode } = useTheme();

  const backgroundImage = props.profile_picture
    ? `url(${encodeURI(props.profile_picture)})`
    : 'url(/placeholder-pet.jpg)'; // fallback si pas d'image

  return (
    // ← ICI : toute la carte devient un lien vers /pet/123
    <Link
      to={`/pet/${props.id}`}
      className="block w-full max-w-sm mx-auto" // centré et responsive
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="relative p-4 flex flex-col justify-end rounded-xl xl:rounded-2xl w-full h-96 bg-cover bg-center transition-all duration-300 cursor-pointer overflow-hidden"
        style={{
          backgroundImage,
          boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(163, 163, 163, 0.4), 0 8px 10px -6px rgba(163, 163, 163, 0.4)',
        }}
      >
        {/* Overlay sombre en bas */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-12 backdrop-blur-sm rounded-b-xl xl:rounded-b-2xl transition-colors duration-300"
          style={{
            background: isDarkMode
              ? 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
              : 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)',
          }}
        >
          <div className="relative z-10">
            <h2
              className="font-playfair text-2xl font-bold mb-1 transition-colors duration-300"
              style={{ color: isDarkMode ? '#F5F3ED' : '#36332E' }}
            >
              {props.name}
            </h2>

            <div
              className="font-raleway text-sm flex gap-2 font-light mb-3 transition-colors duration-300"
              style={{ color: isDarkMode ? '#F7F5EA' : '#555' }}
            >
              {props.type && <span>{props.type}</span>}
              {props.type && props.age && <span>•</span>}
              {props.age && <span>{props.age} year{props.age > 1 ? 's' : ''}</span>}
            </div>

            <p
              className="text-sm line-clamp-2 transition-colors duration-300"
              style={{ color: isDarkMode ? '#E5E1D9' : '#666' }}
            >
              {props.description || 'Aucune description disponible.'}
            </p>
          </div>
        </div>

        {/* Optionnel : petit indicateur visuel au hover */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-xl xl:rounded-2xl" />
      </motion.div>
    </Link>
  );
}