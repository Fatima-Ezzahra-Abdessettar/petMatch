import { useParams, useNavigate } from "react-router";
import AdoptionForm from "~/components/AdoptionForm";
import { useEffect } from "react";

export default function PetAdoptionPage() {
  const params = useParams();
  const navigate = useNavigate();
  
  // Get petId from params
  const petId = params.id;

  // Debug log
  useEffect(() => {
    console.log("🐾 Pet Adoption Page - petId:", petId);
    console.log("🐾 All params:", params);
  }, [petId, params]);

  if (!petId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Pet ID not found</div>
      </div>
    );
  }

  return (
    <AdoptionForm 
      petId={parseInt(petId, 10)} 
      onSuccess={() => {
        console.log("✅ Adoption form submitted successfully!");
        // Redirect after successful submission
        navigate('/requests');
      }} 
    />
  );
}
