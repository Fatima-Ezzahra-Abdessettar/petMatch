import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const PasswordChangeForm: React.FC = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const password = watch('password');

    const onSubmit = async (data: any) => {
        if (data.password !== data.password_confirmation) {
            return alert('Les mots de passe ne correspondent pas');
        }
        try {
            await axios.put('/api/me', {
                password: data.password,
                password_confirmation: data.password_confirmation,
            }); // Appel backend PUT /me
            reset();
            alert('Mot de passe changé !');
        } catch (error) {
            alert('Erreur lors du changement');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="mb-4">
                <label className="block text-gray-700">Nouveau mot de passe</label>
                <input type="password" {...register('password')} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Confirmer</label>
                <input type="password" {...register('password_confirmation')} className="border p-2 w-full rounded" />
            </div>
            <button type="submit" className="bg-purple-500 text-white p-2 rounded">Changer</button>
        </form>
    );
};

export default PasswordChangeForm;