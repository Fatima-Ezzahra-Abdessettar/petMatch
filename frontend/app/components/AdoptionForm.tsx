import React, { useState } from 'react';
import api from '~/api/client';
import { useNavigate } from 'react-router';
import { useTheme } from '~/contexts/themeContext';

// Inline SVG Icons
const CheckCircle2 = () => (
  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface AdoptionFormProps {
  petId: number;
  onSuccess?: () => void;
}

interface FormData {
  perspectiveParent: 'single' | 'family';
  phoneNumber: string;
  age: string;
  partnerName: string;
  partnerPhoneNumber: string;
  partnerAge: string;
  hasChildren: boolean | null;
  childrenCount: string;
  address: string;
  otherPets: boolean | null;
  housingType: string;
  ownOrRent: string;
  hasYard: boolean | null;
  adoptionMotivation: string;
  concerns: {
    allergies: boolean;
    movingToNewHome: boolean;
    behavioralIssues: boolean;
    financialIssue: boolean;
    lackOfTime: boolean;
    other: boolean;
  };
  otherConcernDetails: string;
  agreedToTerms: boolean;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ petId, onSuccess }) => {
  const { isDarkMode } = useTheme(); // ← Add this
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    perspectiveParent: 'single',
    phoneNumber: '',
    age: '',
    partnerName: '',
    partnerPhoneNumber: '',
    partnerAge: '',
    hasChildren: null,
    childrenCount: '',
    address: '',
    otherPets: null,
    housingType: '',
    ownOrRent: '',
    hasYard: null,
    adoptionMotivation: '',
    concerns: {
      allergies: false,
      movingToNewHome: false,
      behavioralIssues: false,
      financialIssue: false,
      lackOfTime: false,
      other: false
    },
    otherConcernDetails: '',
    agreedToTerms: false
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateConcerns = (concern: keyof FormData['concerns'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      concerns: {
        ...prev.concerns,
        [concern]: checked
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        if (!formData.phoneNumber || !formData.age || !formData.address) {
          setError('Please fill in all required fields (*)');
          return false;
        }
        if (formData.hasChildren && !formData.childrenCount) {
          setError('Please specify number of children');
          return false;
        }
        break;
      case 2:
        if (formData.otherPets === null || !formData.housingType || !formData.ownOrRent || formData.hasYard === null) {
          setError('Please answer all required housing questions (*)');
          return false;
        }
        break;
      case 3:
        if (!formData.adoptionMotivation.trim()) {
          setError('Please describe why you want this pet (*)');
          return false;
        }
        if (formData.concerns.other && !formData.otherConcernDetails.trim()) {
          setError('Please specify other concerns');
          return false;
        }
        if (!formData.agreedToTerms) {
          setError('Please agree to terms and conditions (*)');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

const handleSubmit = async () => {
  if (!validateStep(3)) return;

  setIsSubmitting(true);
  setError(null);

  try {
    const submissionData = {
      form_data: {
        perspectiveParent: formData.perspectiveParent,
        phoneNumber: formData.phoneNumber,
        age: formData.age,
        partnerName: formData.partnerName || null,
        partnerPhoneNumber: formData.partnerPhoneNumber || null,
        partnerAge: formData.partnerAge || null,
        children: formData.hasChildren,
        childrenDetails: formData.childrenCount || null,
        address: formData.address,
        otherPets: formData.otherPets,
        housingType: formData.housingType,
        ownOrRent: formData.ownOrRent,
        hasYard: formData.hasYard,
        adoptionMotivation: formData.adoptionMotivation,
        concerns: formData.concerns,
        otherConcernDetails: formData.otherConcernDetails || null,
        agreeTerms: formData.agreedToTerms
      }
    };

    console.log('📤 Submitting adoption application:', submissionData);
    
    // Use api client - it automatically adds the auth token!
    const response = await api.post(`/api/pets/${petId}/apply`, submissionData);
    
    console.log('✅ Application submitted successfully:', response.data);
    
    setSuccess(true);
    setCurrentStep(4);
    if (onSuccess) onSuccess();
  } catch (err: any) {
    console.error('❌ Submission error:', err);
    
    // Better error messages
    if (err.response?.status === 401) {
      setError('You must be logged in to submit an adoption application.');
    } else {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit application. Please try again.';
      setError(errorMessage);
    }
  } finally {
    setIsSubmitting(false);
  }
};
   

  const tabs = [
    { id: 1, label: 'Personal information', active: currentStep === 1 },
    { id: 2, label: 'Housing & accommodations', active: currentStep === 2 },
    { id: 3, label: 'Request details', active: currentStep === 3 }
  ];

  return (
    <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#1a1a1a' }}
    >
      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <XIcon className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-black">PETM</span>
                <span className="text-purple-700">
                  <svg className="inline w-8 h-8 mx-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm7 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM5 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm14 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM9 17c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 3c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z"/>
                  </svg>
                </span>
                <span className="text-black">TCH</span>
              </h1>
            </div>

            <div className="text-sm text-gray-700 space-y-4">
              <p className="text-center font-medium text-base">
                Thank you for choosing to adopt a pet from petMatch. Every animal and every home is unique. We are here to help you find the right pet. We use this application as a starting point to match your lifestyle, needs, and experience with the animals we so well. We are committed to finding each animal the right match.
              </p>

              <h3 className="text-lg font-bold mt-6 mb-3">Before you send in your application, please note:</h3>
              
              <p>Most adoptions are handled as foster-to-adopt cases. Please familiarize yourself with the adoption process prior to submitting your adoption application.</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Animals first come to the shelter either as strays; as a result of a cruelty investigation; or because they've been signed over by a previous owner.</li>
                <li>We cannot guarantee temperament of our animals. Most animals come to us without any background history. We disclose any information that is given to us on a surrender form and what is discovered during a behavior assessment; however, this still does not guarantee temperament, as temperament is often an effect of environment and circumstance.</li>
                <li>We cannot guarantee the health of our animals. We disclose observations that are revealed during an exam and information that is provided at the time of surrender.</li>
              </ul>

              <h3 className="text-lg font-bold mt-6 mb-3">IMPORTANT INFORMATION:</h3>
              
              <ol className="list-decimal pl-6 space-y-2">
                <li>All adopters are responsible for veterinary care and medical bills incurred post adoption.</li>
                <li>If for whatever reason, you must re-home your new pet, you must first contact petMatch.</li>
                <li>We reserves the right to verify all information provided on the adoption application (veterinary reference, landlord, etc.)</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-black">PETM</span>
            <span className="text-purple-700">
              <svg className="inline w-8 h-8 mx-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm7 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM5 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm14 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM9 17c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 3c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z"/>
              </svg>
            </span>
            <span className="text-black">TCH</span>
          </h1>
          <h2 className="text-2xl text-amber-700 font-serif mb-4">Pet Adoption Form</h2>
          <p className="text-gray-600 text-sm">
            Apply to adopt a pet by completing this form. Please provide accurate information to help us take the right decision.
          </p>
        </div>

        {/* Tabs */}
        {currentStep < 4 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => currentStep > tab.id && setCurrentStep(tab.id)}
                disabled={currentStep < tab.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab.active
                    ? 'bg-purple-700 text-white'
                    : currentStep > tab.id
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Perspective pet parent is: <span className="text-red-600">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="parentType"
                    checked={formData.perspectiveParent === 'single'}
                    onChange={() => updateField('perspectiveParent', 'single')}
                    className="mt-1 w-4 h-4 text-purple-700"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Single</div>
                    <div className="text-sm text-gray-500">You will be the only one responsible for the pet</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="parentType"
                    checked={formData.perspectiveParent === 'family'}
                    onChange={() => updateField('perspectiveParent', 'family')}
                    className="mt-1 w-4 h-4 text-purple-700"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Family</div>
                    <div className="text-sm text-gray-500">More than one person will be responsible for the pet</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+225 7777777777"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                            }`}                
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="28"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                            }`}               
                />
              </div>
            </div>

            {formData.perspectiveParent === 'family' && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-4 italic">Partner details are optional</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name</label>
                    <input
                      type="text"
                      placeholder="Ahmed Bennani"
                      value={formData.partnerName}
                      onChange={(e) => updateField('partnerName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                                  isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                                }`}                    
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Phone number</label>
                    <input
                      type="tel"
                      placeholder="+225 7777777777"
                      value={formData.partnerPhoneNumber}
                      onChange={(e) => updateField('partnerPhoneNumber', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                                  isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                                }`}                    
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Age</label>
                    <input
                      type="number"
                      placeholder="28"
                      value={formData.partnerAge}
                      onChange={(e) => updateField('partnerAge', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                                  isDarkMode 
                                    ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                                }`}                   
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Do you have children?</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasChildren"
                        checked={formData.hasChildren === true}
                        onChange={() => updateField('hasChildren', true)}
                        className="w-4 h-4 text-purple-700"
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasChildren"
                        checked={formData.hasChildren === false}
                        onChange={() => updateField('hasChildren', false)}
                        className="w-4 h-4 text-purple-700"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {formData.hasChildren && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">If yes, how many?</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={formData.childrenCount}
                      onChange={(e) => updateField('childrenCount', e.target.value)}
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Tanger Boukhalef"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                          }`}   
               />
            </div>
          </div>
        )}

        {/* Step 2: Housing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have any pets? <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="otherPets"
                    checked={formData.otherPets === true}
                    onChange={() => updateField('otherPets', true)}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="otherPets"
                    checked={formData.otherPets === false}
                    onChange={() => updateField('otherPets', false)}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Housing type <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.housingType}
                onChange={(e) => updateField('housingType', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                          }`}              
              >
                <option value="">Select housing type</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="CONDO">Condo</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you own or rent your home? <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ownOrRent"
                    checked={formData.ownOrRent === 'Own'}
                    onChange={() => updateField('ownOrRent', 'Own')}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">Own</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ownOrRent"
                    checked={formData.ownOrRent === 'Rent'}
                    onChange={() => updateField('ownOrRent', 'Rent')}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">Rent</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have a yard? <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasYard"
                    checked={formData.hasYard === true}
                    onChange={() => updateField('hasYard', true)}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasYard"
                    checked={formData.hasYard === false}
                    onChange={() => updateField('hasYard', false)}
                    className="w-4 h-4 text-purple-700"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Request Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                In a few words describe why you want this pet: <span className="text-red-600">*</span>
              </label>
              <textarea
                placeholder="I'm looking for a companion to join our family..."
                value={formData.adoptionMotivation}
                onChange={(e) => updateField('adoptionMotivation', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Check if any of the following reasons would prevent you from keeping the pet long-term:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'allergies' as const, label: 'Allergies' },
                  { id: 'movingToNewHome' as const, label: 'Moving to a new home' },
                  { id: 'behavioralIssues' as const, label: 'Behavioral issues' },
                  { id: 'financialIssue' as const, label: 'Financial issue' },
                  { id: 'lackOfTime' as const, label: 'Lack of time' },
                  { id: 'other' as const, label: 'Other (specify)' }
                ].map((concern) => (
                  <label key={concern.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.concerns[concern.id]}
                      onChange={(e) => updateConcerns(concern.id, e.target.checked)}
                      className="w-4 h-4 text-purple-700 rounded"
                    />
                    <span className="text-gray-700">{concern.label}</span>
                  </label>
                ))}
              </div>
              
              {formData.concerns.other && (
                <input
                  type="text"
                  placeholder="Please specify..."
                  value={formData.otherConcernDetails}
                  onChange={(e) => updateField('otherConcernDetails', e.target.value)}
                  className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-purple-700 rounded"
                />
                <span className="text-sm text-gray-600">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-purple-700 underline hover:text-purple-800"
                  >
                    terms and conditions
                  </button>{' '}
                  <span className="text-red-600">*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && success && (
          <div className="text-center py-12">
            <CheckCircle2 />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-8">
              Thank you for your application. We'll review it and get back to you soon.
            </p>
            <button
              onClick={() => navigate('/our-pets')}
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
            >
              Back to Browse Pets
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ← Previous
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Send Request'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionForm;