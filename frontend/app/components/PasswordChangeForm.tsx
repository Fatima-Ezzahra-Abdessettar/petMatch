import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordChangeForm: React.FC = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const password = watch('password');

    const onSubmit = async (data: any) => {
        if (data.password !== data.password_confirmation) {
            toast.error('Passwords do not match', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        try {
            await axios.put('/api/me', {
                password: data.password,
                password_confirmation: data.password_confirmation,
            });
            reset();
            toast.success('Password changed successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error changing password';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input 
                        type="password" 
                        {...register('password')} 
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        {...register('password_confirmation')} 
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                >
                    <span>+</span> Save new password
                </button>
            </div>
        </form>
    );
};

export default PasswordChangeForm;
