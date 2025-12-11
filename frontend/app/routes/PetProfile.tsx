// src/app/routes/PetProfile.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHeart as faHeartRegular,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/SideBar'; 
import { UserContext } from '~/contexts/UserContext';

interface Pet {
  id: number;
  name: string;
  profile_picture: string;
  species: string;
  type: string;
  age: number;
  gender: string;
  description: string;
  eye_color?: string;
  coat_color?: string;
  shelter: {
    id: number;
    name: string;
    city: string;
  };
}

const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(UserContext)!;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État de la sidebar (partagé avec listepets)
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  const API_URL = `http://127.0.0.1:8000/api/pets/${id}`;

  const isFavorite = pet ? favorites.some((fav: any) => fav.id === pet.id) : false;

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          headers: {
            Accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data: Pet = await response.json();
        setPet(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger l'animal");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, token]);

  const handleToggleFavorite = async () => {
    if (!pet) return;
    await toggleFavorite(pet.id, isFavorite);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5]">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isOpen ? 'lg:ml-52' : 'lg:ml-20'}`}>
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" />
        </div>
      </div>
    );
  }

  // Error ou pet non trouvé
  if (error || !pet) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5]">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex items-center justify-center p-5 transition-all duration-300 ${isOpen ? 'lg:ml-52' : 'lg:ml-20'}`}>
          <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff6b6b" className="mb-4" />
            <h3 className="text-2xl font-bold text-[#333] mb-3">Animal non trouvé</h3>
            <p className="text-[#666] mb-6">{error || "Cet animal n'existe pas ou a été supprimé."}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-[#D29059] text-white rounded-xl hover:bg-[#c57a45] transition"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-52' : 'lg:ml-0'}`}>
        <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-3 text-[#666] hover:text-[#D29059] text-lg font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Retour à la liste
          </button>

          {/* Carte principale */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-10 lg:p-12">
              {/* En-tête */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#333]">{pet.name}</h1>
                  <p className="text-xl text-[#666] mt-2">
                    {pet.gender === 'male' ? 'Mâle' : 'Femelle'} • {pet.age} an{pet.age > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="p-4 rounded-2xl bg-[#f9f9f9] hover:bg-[#FEF3DD] hover:scale-110 transition-all"
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <FontAwesomeIcon
                    icon={isFavorite ? faHeartSolid : faHeartRegular}
                    className={`text-4xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              {/* Grille responsive : photo + infos */}
              <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
                {/* Photo */}
                <div className="relative group">
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={pet.profile_picture || '/placeholder-pet.jpg'}
                      alt={pet.name}
                      className="w-full h-96 md:h-[500px] lg:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Infos */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-[#333] mb-4">Informations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InfoItem label="Espèce" value={pet.species === 'dog' ? 'Chien' : pet.species === 'cat' ? 'Chat' : pet.species} />
                      <InfoItem label="Race" value={pet.type || 'Non spécifiée'} />
                      <InfoItem label="Âge" value={`${pet.age} an${pet.age > 1 ? 's' : ''}`} />
                      <InfoItem label="Sexe" value={pet.gender === 'male' ? 'Mâle' : 'Femelle'} />
                      {pet.coat_color && <InfoItem label="Couleur du pelage" value={pet.coat_color} />}
                      {pet.eye_color && <InfoItem label="Couleur des yeux" value={pet.eye_color} />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#333] mb-4">Refuge</h3>
                    <div className="p-5 bg-[#f9f9f9] rounded-2xl">
                      <p className="font-medium text-[#333]">{pet.shelter.name}</p>
                      <p className="text-[#666] text-sm">{pet.shelter.city}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#333] mb-4">À propos</h3>
                    <p className="text-[#555] leading-relaxed text-base">
                      {pet.description || 'Aucune description disponible pour le moment.'}
                    </p>
                  </div>

                  {/* Bouton d'adoption */}
                  <button className="w-full py-5 bg-gradient-to-r from-[#D29059] to-[#c57a45] hover:from-[#c57a45] hover:to-[#b86b3b] text-white text-xl font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faHeartRegular} className="text-2xl" />
                    Je veux adopter {pet.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Petit composant réutilisable pour les infos
const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-[#999] mb-1">{label}</p>
    <p className="px-4 py-3 bg-[#f9f9f9] rounded-xl font-medium text-[#333]">{value}</p>
  </div>
);

export default PetProfile;