// src/app/routes/PetProfile.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faHeart as faHeartRegular,
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '~/contexts/UserContext'; // ← même chemin que dans Favorites.tsx

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
const API_URL = `http://localhost:8000/api/pets/${id}`;  
  const isFavorite = favorites.some((fav: any) => fav.id === Number(id));

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
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

  const photos = pet?.profile_picture ? [pet.profile_picture] : [];

  if (loading) return <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center"><FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" /></div>;
  if (error || !pet) return <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center"><div className="bg-white p-10 rounded-xl shadow-lg text-center"><h3 className="text-2xl font-bold">Animal non trouvé</h3><p>{error}</p><button onClick={() => navigate(-1)} className="mt-4 px-6 py-3 bg-[#D29059] text-white rounded-lg">Retour</button></div></div>;

  return (
    <div className="min-h-screen bg-[#E5E5E5] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[#666] hover:text-[#D29059] text-sm font-medium">
          <FontAwesomeIcon icon={faArrowLeft} /> Retour à la liste
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-4xl font-bold text-[#333]">{pet.name}</h1>
              <button onClick={handleToggleFavorite} className="hover:scale-110 transition">
                <FontAwesomeIcon
                  icon={isFavorite ? faHeartSolid : faHeartRegular}
                  className={`text-4xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="relative rounded-2xl overflow-hidden">
                <img src={photos[currentPhotoIndex] || '/placeholder-pet.jpg'} alt={pet.name} className="w-full h-[500px] object-cover" />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="text-sm text-[#999]">Nom</label><div className="mt-1 px-4 py-3 bg-[#f9f9f9] rounded-lg font-medium">{pet.name}</div></div>
                  <div><label className="text-sm text-[#999]">Âge</label><div className="mt-1 px-4 py-3 bg-[#f9f9f9] rounded-lg font-medium">{pet.age} an{pet.age > 1 ? 's' : ''}</div></div>
                </div>

                <div>
                  <label className="text-sm text-[#999]">Description</label>
                  <div className="mt-1 px-4 py-4 bg-[#f9f9f9] rounded-lg leading-relaxed">{pet.description || 'Aucune description disponible.'}</div>
                </div>

                <div className="pt-6">
                  <button className="w-full py-5 bg-[#6B4E9C] hover:bg-[#5a3d87] text-white text-xl font-bold rounded-xl flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faHeartRegular} /> Adopter {pet.name}
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

export default PetProfile;