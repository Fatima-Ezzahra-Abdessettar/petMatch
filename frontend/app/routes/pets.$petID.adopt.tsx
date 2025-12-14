import { useParams, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import AdoptionForm from "~/components/AdoptionForm";
import api from "~/api/client";

export default function PetAdoptionPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = params.id;
  const editId = searchParams.get('edit');
  
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      fetchExistingRequest();
    }
  }, [editId]);

  const fetchExistingRequest = async () => {
    try {
      const response = await api.get('/api/adoptions');
      const request = response.data.find((r: any) => r.id === parseInt(editId!));
      
      if (request) {
        setExistingData(request.form_data);
      } else {
        alert('Request not found');
        navigate(-1);
      }
    } catch (err) {
      console.error('Failed to fetch request:', err);
      alert('Failed to load request data');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (!petId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Pet ID not found</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3" style={{ borderColor: '#d97706' }} />
      </div>
    );
  }

  return (
    <AdoptionForm 
      petId={parseInt(petId, 10)}
      editMode={!!editId}
      editRequestId={editId ? parseInt(editId) : undefined}
      initialData={existingData}
      onSuccess={() => {
        navigate('/requests');
      }} 
    />
  );
}