// frontend/src/app/routes/PetProfile.tsx
import React, { useState, useEffect } from 'react';
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

interface Shelter {
  id: number;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
}

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
  shelter: Shelter;
  photos?: string[];
}

const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const API_URL = `http://127.0.0.1:8000/api/pets/${id}`;

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const data: Pet = await response.json();
        setPet(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const allPhotos = pet?.photos || [pet?.profile_picture].filter(Boolean);

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#D29059" />
          <p className="mt-5 text-lg text-[#666]">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-5">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" color="#ff6b6b" />
          <h3 className="mt-5 text-xl font-semibold text-[#333]">Animal non trouvé</h3>
          <p className="text-[#666] mt-3">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 px-6 py-3 bg-[#D29059] text-white rounded-md hover:bg-[#c57a45]">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] py-8 px-5">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-[#666] hover:text-[#D29059] text-sm font-medium">
          <FontAwesomeIcon icon={faArrowLeft} /> Retour à la liste
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 lg:p-12">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#333]">{pet.name}</h1>
            <button onClick={() => setIsFavorite(!isFavorite)}>
              <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} className={isFavorite ? 'text-red-500 text-3xl' : 'text-gray-400 text-3xl'} />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Photos */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img src={allPhotos[currentPhotoIndex]} alt={pet.name} className="w-full h-[500px] object-cover" />
                {allPhotos.length > 1 && (
                  <>
                    <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-12 h-12 shadow-lg">
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-12 h-12 shadow-lg">
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Infos */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-[#999]">Full Name</label><input readOnly value={pet.name} className="w-full px-4 py-3 bg-[#f9f9f9] rounded-lg" /></div>
                <div><label className="text-sm text-[#999]">Age</label><input readOnly value={`${pet.age} year${pet.age > 1 ? 's' : ''}`} className="w-full px-4 py-3 bg-[#f9f9f9] rounded-lg" /></div>
              </div>
              {/* ... le reste des champs comme dans le code précédent ... */}
              <div className="pt-6">
                <button className="w-full px-12 py-4 bg-[#6B4E9C] hover:bg-[#5a3d87] text-white font-semibold rounded-lg flex items-center justify-center gap-3">
                  <FontAwesomeIcon icon={faHeartRegular} /> Adopt {pet.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;