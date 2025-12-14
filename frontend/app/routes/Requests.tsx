import { useEffect, useState } from 'react';
import api from '~/api/client';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import AuthenticatedLayout from '~/components/AuthenticatedLayout';

interface Pet {
  id: number;
  name: string;
  species: string | null;
}

interface AdoptionRequest {
  id: number;
  pet_id: number;
  pet?: Pet;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  form_data: any;
}

export default function Requests() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/adoptions');
      
      // Fetch pet details for each request
      const requestsWithPets = await Promise.all(
        response.data.map(async (req: AdoptionRequest) => {
          try {
            const petResponse = await api.get(`/api/pets/${req.pet_id}`);
            return { ...req, pet: petResponse.data };
          } catch {
            return req;
          }
        })
      );
      
      setRequests(requestsWithPets);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load adoption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRetract = async (requestId: number) => {
    if (!confirm('Are you sure you want to retract this adoption request?')) return;
    
    try {
      // Add retract endpoint when backend is ready
      // await api.delete(`/api/adoptions/${requestId}`);
      alert('Retract functionality will be implemented soon');
      setShowOptionsMenu(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to retract request');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(255, 238, 225, 1)', text: 'rgba(210, 144, 89, 1)', label: 'En Attente' };
      case 'approved':
        return { bg: '#d1fae5', text: '#059669', label: 'Acceptée' };
      case 'denied':
        return { bg: '#fee2e2', text: '#dc2626', label: 'Rejetée' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', label: status };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredRequests = requests.filter(req =>
    req.id.toString().includes(searchTerm) || 
    req.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.pet?.species?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const capitalizeFirst = (str: string | null | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3" style={{ borderColor: '#d97706' }} />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>Requests</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>View all pet requests and their status</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Demandes d'adoption</h2>

            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for a request"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border outline-none focus:border-[#d97706] transition-colors"
                  style={{ 
                    borderColor: '#d1d5db',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Request ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Species
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Pet Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      View Pet
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                      Option
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8" style={{ color: '#6b7280' }}>
                        No adoption requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => {
                      const statusStyle = getStatusStyle(request.status);
                      const isPending = request.status === 'pending';
                      
                      return (
                        <motion.tr
                          key={request.id}
                          className="border-b transition-colors"
                          style={{ borderColor: '#f3f4f6' }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        >
                          <td className="py-4 px-4 text-sm" style={{ color: '#1f2937' }}>
                            #{request.id}
                          </td>
                          <td className="py-4 px-4 text-sm" style={{ color: '#6b7280' }}>
                            {capitalizeFirst(request.pet?.species) || 'Unknown'}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium" style={{ color: '#1f2937' }}>
                            {request.pet?.name || 'Unknown Pet'}
                          </td>
                          <td className="py-4 px-4 text-sm" style={{ color: '#6b7280' }}>
                            {formatDate(request.created_at)}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text
                              }}
                            >
                              {statusStyle.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              to={`/pet/${request.pet_id}`}
                              className="px-4 py-1 rounded-lg border text-sm hover:bg-gray-50 transition-colors inline-block"
                              style={{
                                borderColor: '#d1d5db',
                                color: '#1f2937'
                              }}
                            >
                              View
                            </Link>
                          </td>
                          <td className="py-4 px-4 relative">
                            <button 
                              onClick={() => setShowOptionsMenu(showOptionsMenu === request.id ? null : request.id)}
                              className="p-1 hover:text-gray-600 transition-colors"
                              style={{ color: '#9ca3af' }}
                            >
                              ⋮
                            </button>
                            
                            {/* Options Dropdown */}
                            {showOptionsMenu === request.id && (
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-10" style={{ borderColor: '#e5e7eb' }}>
                                <div className="py-1">
                                  {isPending && (
                                    <>
                                      <Link
                                        to={`/pet/${request.pet_id}/adopt?edit=${request.id}`}
                                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        style={{ color: '#374151' }}
                                        onClick={() => setShowOptionsMenu(null)}
                                      >
                                        Edit Request Form
                                      </Link>
                                      <button
                                        onClick={() => handleRetract(request.id)}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        style={{ color: '#dc2626' }}
                                      >
                                        Retract Request
                                      </button>
                                    </>
                                  )}
                                  {!isPending && (
                                    <div className="px-4 py-2 text-sm italic" style={{ color: '#9ca3af' }}>
                                      No actions available for {request.status} requests
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm" style={{ color: '#6b7280' }}>
                1 - {filteredRequests.length} of {requests.length}
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#d1d5db', color: '#6b7280' }}
                >
                  ←
                </button>
                <button 
                  className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#d1d5db', color: '#6b7280' }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}