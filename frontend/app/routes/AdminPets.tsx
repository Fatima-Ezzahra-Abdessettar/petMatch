import React, { useState, useEffect } from 'react';
import { petsService } from '../api/petsService';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useTheme } from '../contexts/themeContext';
import type { Pet } from '../api/petsService';

const AdminPets: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    type: '',
    age: '',
    gender: 'male',
    profile_picture: '',
    status: 'available',
    description: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await petsService.getAdminPets();
      setPets(data);
    } catch (err) {
      setError('Failed to load pets');
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      type: '',
      age: '',
      gender: 'male',
      profile_picture: '',
      status: 'available',
      description: ''
    });
    setEditingPet(null);
    setShowCreateForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const petData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        species: formData.species || null,
        type: formData.type || null,
        profile_picture: formData.profile_picture || null
      };
      await petsService.createPet(petData);
      resetForm();
      fetchPets();
    } catch (err) {
      console.error('Error creating pet:', err);
      alert('Failed to create pet');
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species || '',
      type: pet.type || '',
      age: pet.age?.toString() || '',
      gender: pet.gender,
      profile_picture: pet.profile_picture || '',
      status: pet.status,
      description: pet.description
    });
    setShowCreateForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPet) return;

    try {
      const petData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        species: formData.species || null,
        type: formData.type || null,
        profile_picture: formData.profile_picture || null
      };
      await petsService.updatePet(editingPet.id, petData);
      resetForm();
      fetchPets();
    } catch (err) {
      console.error('Error updating pet:', err);
      alert('Failed to update pet');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    try {
      await petsService.deletePet(id);
      fetchPets();
    } catch (err) {
      console.error('Error deleting pet:', err);
      alert('Failed to delete pet');
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}>
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 mx-auto mb-4" style={{ borderColor: isDarkMode ? "#D9915B" : "#D29059" }} />
            <div style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>Loading pets...</div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}>
          <div className="text-center">
            <div style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>{error}</div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="px-8 pb-8 min-h-screen" style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}>
        <div className="mb-6 pt-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
                Manage Pets
              </h1>
              <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                Add, edit, and manage pets in your shelter
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{ backgroundColor: isDarkMode ? "#D9915B" : "#D29059", color: "#FFFFFF" }}
            >
              {showCreateForm ? 'Cancel' : 'Add New Pet'}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-6 p-6 rounded-lg shadow-md" style={{ backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF" }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </h2>
            <form onSubmit={editingPet ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Species
                  </label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={formData.profile_picture}
                  onChange={(e) => setFormData({ ...formData, profile_picture: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: isDarkMode ? "#36332E" : "#FFFFFF", color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-medium transition"
                  style={{ backgroundColor: isDarkMode ? "#D9915B" : "#D29059", color: "#FFFFFF" }}
                >
                  {editingPet ? 'Update Pet' : 'Create Pet'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg font-medium transition"
                  style={{ borderColor: isDarkMode ? "#D9915B" : "#D29059", color: isDarkMode ? "#D9915B" : "#D29059" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="p-4 rounded-lg shadow-md"
              style={{ backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF" }}
            >
              {pet.profile_picture && (
                <img
                  src={pet.profile_picture}
                  alt={pet.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold mb-2" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
                {pet.name}
              </h3>
              <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                {pet.species} • {pet.age ? `${pet.age} years old` : 'Age unknown'}
              </p>
              <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                Status: <span className={`font-medium ${pet.status === 'available' ? 'text-green-600' : pet.status === 'adopted' ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {pet.status}
                </span>
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(pet)}
                  className="px-3 py-1 text-sm rounded transition"
                  style={{ backgroundColor: isDarkMode ? "#D9915B" : "#D29059", color: "#FFFFFF" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && !loading && (
          <div className="text-center py-8">
            <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>No pets found. Add your first pet!</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminPets;
