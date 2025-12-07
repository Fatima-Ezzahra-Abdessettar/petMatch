import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const PersonalDetailsForm: React.FC = () => {
    const { user, setUser } = useContext(UserContext)!;
    const { register, handleSubmit } = useForm({ defaultValues: user });

    const onSubmit = async (data: any) => {
        try {
            const res = await axios.put('/api/me', data); // Appel backend PUT /me
            setUser(res.data.user);
            alert('Profil mis à jour !');
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input {...register('name')} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Téléphone</label>
                <input {...register('phone')} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Location/Ville</label>
                <input {...register('location')} className="border p-2 w-full rounded" />
            </div>
            <button type="submit" className="bg-orange-500 text-white p-2 rounded">Sauvegarder</button>
        </form>
    );
};

export default PersonalDetailsForm;