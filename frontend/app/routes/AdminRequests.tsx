import React, { useState, useEffect } from 'react';
import { petsService } from '../api/petsService';
import type { AdoptionApplication } from '../api/petsService';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useTheme } from '../contexts/themeContext';

const AdminRequests: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await petsService.getAdminAdoptionApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to load adoption applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      await petsService.updateAdoptionApplicationStatus(id, status);
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );
      setNotification({ type: 'success', message: `Application ${status} successfully!` });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error updating application status:', err);
      setNotification({ type: 'error', message: 'Failed to update application status' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeny = (id: number) => {
    if (window.confirm('Are you sure you want to deny this application?')) {
      updateApplicationStatus(id, 'denied');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', color: isDarkMode ? '#6EE7B7' : '#065F46' };
      case 'denied':
        return { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', color: isDarkMode ? '#FCA5A5' : '#991B1B' };
      case 'pending':
        return { backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.2)' : '#FEF3C7', color: isDarkMode ? '#FCD34D' : '#92400E' };
      default:
        return { backgroundColor: isDarkMode ? 'rgba(156, 163, 175, 0.2)' : '#F3F4F6', color: isDarkMode ? '#D1D5DB' : '#4B5563' };
    }
  };

  const filteredApplications = applications.filter(app =>
    app.id.toString().includes(searchTerm) ||
    app.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.pet.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}>
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 mx-auto mb-4" style={{ borderColor: isDarkMode ? "#D9915B" : "#D29059" }} />
            <div style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>Loading applications...</div>
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
        {/* Notification Toast */}
        {notification && (
          <div
            className="fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all"
            style={{
              backgroundColor: notification.type === 'success'
                ? (isDarkMode ? 'rgba(16, 185, 129, 0.9)' : '#10B981')
                : (isDarkMode ? 'rgba(239, 68, 68, 0.9)' : '#EF4444'),
              color: '#FFFFFF'
            }}
          >
            {notification.message}
          </div>
        )}

        <div className="mb-6 pt-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
                Adoption Applications
              </h1>
              <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                Manage adoption applications for your shelter's pets
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search applications by pet name, user name, or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF",
              color: isDarkMode ? "#F7F5EA" : "#6B5B4A",
              borderColor: isDarkMode ? "#73655B" : "#D1D5DB"
            }}
          />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                {applications.length === 0 ? 'No adoption applications found' : 'No applications match your search'}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className="p-6 rounded-lg shadow-md"
                style={{ backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
                      Application #{application.id}
                    </h3>
                    <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                      <strong>Pet:</strong> {application.pet.name} ({application.pet.species})
                    </p>
                    <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                      <strong>Applicant:</strong> {application.user.name} ({application.user.email})
                    </p>
                    <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
                      <strong>Submitted:</strong> {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={getStatusBadgeStyle(application.status)}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Application Form Data */}
                {application.form_data && Object.keys(application.form_data).length > 0 && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: isDarkMode ? "#36332E" : "#F9FAFB" }}>
                    <h4 className="font-medium mb-2" style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}>
                      Application Details:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {Object.entries(application.form_data).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium" style={{ color: isDarkMode ? "#D9915B" : "#D29059" }}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                          </span>
                          <span style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}> {String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {application.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                      className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
                      style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(application.id)}
                      className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
                      style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
                    >
                      Deny
                    </button>
                  </div>
                )}

                {application.status !== 'pending' && (
                  <div className="text-sm italic" style={{ color: isDarkMode ? "#D9915B" : "#9CA3AF" }}>
                    This application has been {application.status}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminRequests;