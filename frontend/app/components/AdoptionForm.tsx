import React, { useState } from 'react';
import api from '~/api/client';
import { useNavigate } from 'react-router';
import { useTheme } from '~/contexts/themeContext';

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
  const { isDarkMode } = useTheme();
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

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        if (!formData.phoneNumber || !formData.age || !formData.address) {
          setError('Please fill in all required fields (*)');
          return false;
        }
        if (!validatePhoneNumber(formData.phoneNumber)) {
          setError('Please enter a valid phone number (e.g., +1234567890)');
          return false;
        }
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 18) {
          setError('You must be at least 18 years old to adopt a pet');
          return false;
        }
        if (formData.perspectiveParent === 'family' && formData.partnerPhoneNumber && !validatePhoneNumber(formData.partnerPhoneNumber)) {
          setError('Please enter a valid partner phone number');
          return false;
        }
        if (formData.perspectiveParent === 'family' && formData.partnerAge) {
          const partnerAge = parseInt(formData.partnerAge);
          if (!isNaN(partnerAge) && partnerAge < 18) {
            setError('Partner must be at least 18 years old');
            return false;
          }
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

      const response = await api.post(`/api/pets/${petId}/apply`, submissionData);
      
      // Only proceed if successful
      setSuccess(true);
      setCurrentStep(4);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Stay on current step on error
      if (err.response?.status === 401) {
        setError('You must be logged in to submit an adoption application.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      }
      // Explicitly do NOT change step or navigate
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 1, label: 'Personal information' },
    { id: 2, label: 'Housing & accommodations' },
    { id: 3, label: 'Request details' }
  ];

  const darkBg = 'rgb(115, 101, 91, 0.31)';
  const bg = isDarkMode ? darkBg : 'white';
  const text = isDarkMode ? '#f3f4f6' : '#1f2937';
  const subtext = isDarkMode ? '#d1d5db' : '#6b7280';
  const label = isDarkMode ? '#e5e7eb' : '#374151';
  const inputBg = isDarkMode ? 'transparent' : 'white';
  const inputBorder = isDarkMode ? '#6b7280' : '#d1d5db';
  const inputText = isDarkMode ? '#f3f4f6' : '#1f2937';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: isDarkMode ? '#4a4a4a' : '#f3f4f6' }}>
      {/* Dark mode styling for select dropdowns */}
      {isDarkMode && (
        <style>{`
          select option {
            background-color: rgb(55, 65, 81);
            color: #f3f4f6;
          }
        `}</style>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative" style={{ backgroundColor: isDarkMode ? darkBg : 'white' }}>
            <button 
              onClick={() => setShowTermsModal(false)} 
              className="absolute top-4 right-4 p-2 rounded-full transition-colors"
              style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}
            >
              <XIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-4" style={{ color: text }}>
                <span>PETM</span>
                <span style={{ color: '#7c3aed' }}>❤</span>
                <span>TCH</span>
              </h1>
            </div>

            <div className="text-sm space-y-4" style={{ color: subtext }}>
              <p className="text-center font-medium text-base">
                Thank you for choosing to adopt a pet from petMatch. Every animal and every home is unique. We are here to help you find the right pet. We use this application as a starting point to match your lifestyle, needs, and experience with the animals we so well. We are committed to finding each animal the right match.
              </p>

              <h3 className="text-lg font-bold mt-6 mb-3" style={{ color: text }}>Before you send in your application, please note:</h3>
              
              <p>Most adoptions are handled as foster-to-adopt cases. Please familiarize yourself with the adoption process prior to submitting your adoption application.</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>animals first come to the shelter either as strays; as a result of a cruelty investigation; or because they've been signed over by a previous owner.</li>
                <li>We cannot guarantee temperament of our animals. Most animals come to us without any background history. We disclose any information that is given to us on a surrender form and what is discovered during a behavior assessment; however, this still does not guarantee temperament, as temperament is often an effect of environment and circumstance.</li>
                <li>We cannot guarantee the health of our animals. We disclose observations that are revealed during an exam and information that is provided at the time of surrender.</li>
              </ul>

              <h3 className="text-lg font-bold mt-6 mb-3" style={{ color: text }}>IMPORTANT INFORMATION:</h3>
              
              <ol className="list-decimal pl-6 space-y-2">
                <li>All adopters are responsible for veterinary care and medical bills incurred post adoption.</li>
                <li>If for whatever reason, you must re-home your new pet, you must first contact petMatch.</li>
                <li>we reserves the right to verify all information provided on the adoption application (veterinary reference, landlord, etc.)</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl shadow-2xl max-w-2xl w-full p-8" style={{ backgroundColor: bg }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: text }}>PETMATCH</h1>
          <h2 className="text-2xl font-serif mb-4" style={{ color: '#d97706' }}>Pet Adoption Form</h2>
          <p className="text-sm" style={{ color: subtext }}>Apply to adopt a pet by completing this form.</p>
        </div>

        {currentStep < 4 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((tab, idx) => (
              <button 
                key={idx} 
                onClick={() => currentStep > idx + 1 && setCurrentStep(idx + 1)} 
                disabled={currentStep < idx + 1}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: currentStep === idx + 1 ? '#7c3aed' : currentStep > idx + 1 ? (isDarkMode ? '#5b21b6' : '#ede9fe') : (isDarkMode ? '#473751ff' : '#f5f3f6ff'),
                  color: currentStep === idx + 1 ? 'white' : currentStep > idx + 1 ? (isDarkMode ? '#e9d5ff' : '#7c3aed') : (isDarkMode ? '#746b80ff' : '#a69cafff'),
                  cursor: currentStep > idx + 1 ? 'pointer' : currentStep === idx + 1 ? 'default' : 'not-allowed'
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg flex gap-3" style={{ 
            backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2', 
            border: `1px solid ${isDarkMode ? '#991b1b' : '#fecaca'}` 
          }}>
            <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
            <p className="text-sm" style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}>{error}</p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: text }}>
                Perspective pet parent is: <span className="text-red-600">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex gap-3">
                  <input type="radio" checked={formData.perspectiveParent === 'single'} onChange={() => updateField('perspectiveParent', 'single')} className="mt-1 w-4 h-4" />
                  <div>
                    <div className="font-medium" style={{ color: text }}>Single</div>
                    <div className="text-sm" style={{ color: subtext }}>You will be the only one responsible</div>
                  </div>
                </label>
                <label className="flex gap-3">
                  <input type="radio" checked={formData.perspectiveParent === 'family'} onChange={() => updateField('perspectiveParent', 'family')} className="mt-1 w-4 h-4" />
                  <div>
                    <div className="font-medium" style={{ color: text }}>Family</div>
                    <div className="text-sm" style={{ color: subtext }}>More than one person will be responsible</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: label }}>Phone number <span className="text-red-600">*</span></label>
                <input 
                  type="tel" 
                  placeholder="+225 7777777777" 
                  value={formData.phoneNumber} 
                  onChange={(e) => updateField('phoneNumber', e.target.value)} 
                  className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                  style={{ 
                    backgroundColor: inputBg, 
                    borderColor: inputBorder, 
                    color: inputText 
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: label }}>Age <span className="text-red-600">*</span></label>
                <input 
                  type="number" 
                  placeholder="28" 
                  value={formData.age} 
                  onChange={(e) => updateField('age', e.target.value)} 
                  className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                  style={{ 
                    backgroundColor: inputBg, 
                    borderColor: inputBorder, 
                    color: inputText 
                  }}
                />
              </div>
            </div>
            {formData.perspectiveParent === 'family' && (
              <>
                <div className="border-t pt-4" style={{ borderColor: inputBorder }}>
                  <p className="text-sm italic" style={{ color: subtext }}>Partner details are optional</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: label }}>Partner Name</label>
                    <input 
                      type="text" 
                      value={formData.partnerName} 
                      onChange={(e) => updateField('partnerName', e.target.value)} 
                      className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: label }}>Partner Phone</label>
                    <input 
                      type="tel" 
                      value={formData.partnerPhoneNumber} 
                      onChange={(e) => updateField('partnerPhoneNumber', e.target.value)} 
                      className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: label }}>Partner Age</label>
                    <input 
                      type="number" 
                      value={formData.partnerAge} 
                      onChange={(e) => updateField('partnerAge', e.target.value)} 
                      className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-3" style={{ color: label }}>Do you have children?</label>
                  <div className="flex gap-6">
                    <label className="flex gap-2">
                      <input type="radio" checked={formData.hasChildren === true} onChange={() => updateField('hasChildren', true)} />
                      <span style={{ color: label }}>Yes</span>
                    </label>
                    <label className="flex gap-2">
                      <input type="radio" checked={formData.hasChildren === false} onChange={() => updateField('hasChildren', false)} />
                      <span style={{ color: label }}>No</span>
                    </label>
                  </div>
                </div>
                {formData.hasChildren && (
                  <div>
                    <label className="block text-sm mb-2" style={{ color: label }}>If yes, how many?</label>
                    <input 
                      type="number" 
                      placeholder="2" 
                      value={formData.childrenCount} 
                      onChange={(e) => updateField('childrenCount', e.target.value)} 
                      className="w-32 px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <label className="block text-sm mb-2" style={{ color: label }}>Address <span className="text-red-600">*</span></label>
              <input 
                type="text" 
                placeholder="Tanger Boukhalef" 
                value={formData.address} 
                onChange={(e) => updateField('address', e.target.value)} 
                className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>Do you have any pets? <span className="text-red-600">*</span></label>
              <div className="flex gap-6">
                <label className="flex gap-2">
                  <input type="radio" checked={formData.otherPets === true} onChange={() => updateField('otherPets', true)} />
                  <span style={{ color: label }}>Yes</span>
                </label>
                <label className="flex gap-2">
                  <input type="radio" checked={formData.otherPets === false} onChange={() => updateField('otherPets', false)} />
                  <span style={{ color: label }}>No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>Housing type <span className="text-red-600">*</span></label>
              <select 
                value={formData.housingType} 
                onChange={(e) => updateField('housingType', e.target.value)} 
                className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
              >
                <option value="">Select housing type</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="CONDO">Condo</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>Do you own or rent your home? <span className="text-red-600">*</span></label>
              <div className="flex gap-6">
                <label className="flex gap-2">
                  <input type="radio" checked={formData.ownOrRent === 'Own'} onChange={() => updateField('ownOrRent', 'Own')} />
                  <span style={{ color: label }}>Own</span>
                </label>
                <label className="flex gap-2">
                  <input type="radio" checked={formData.ownOrRent === 'Rent'} onChange={() => updateField('ownOrRent', 'Rent')} />
                  <span style={{ color: label }}>Rent</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>Do you have a yard? <span className="text-red-600">*</span></label>
              <div className="flex gap-6">
                <label className="flex gap-2">
                  <input type="radio" checked={formData.hasYard === true} onChange={() => updateField('hasYard', true)} />
                  <span style={{ color: label }}>Yes</span>
                </label>
                <label className="flex gap-2">
                  <input type="radio" checked={formData.hasYard === false} onChange={() => updateField('hasYard', false)} />
                  <span style={{ color: label }}>No</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>In a few words describe why you want this pet: <span className="text-red-600">*</span></label>
              <textarea 
                placeholder="I'm looking for a companion..." 
                value={formData.adoptionMotivation} 
                onChange={(e) => updateField('adoptionMotivation', e.target.value)} 
                rows={4} 
                className="w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600 resize-none"
                style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
              />
            </div>
            <div>
              <label className="block text-sm mb-3" style={{ color: label }}>Check if any of the following reasons would prevent you from keeping the pet long-term:</label>
              <div className="space-y-2">
                {[
                  { id: 'allergies' as const, label: 'Allergies' },
                  { id: 'movingToNewHome' as const, label: 'Moving to a new home' },
                  { id: 'behavioralIssues' as const, label: 'Behavioral issues' },
                  { id: 'financialIssue' as const, label: 'Financial issue' },
                  { id: 'lackOfTime' as const, label: 'Lack of time' },
                  { id: 'other' as const, label: 'Other (specify)' }
                ].map((c) => (
                  <label key={c.id} className="flex gap-3">
                    <input type="checkbox" checked={formData.concerns[c.id]} onChange={(e) => updateConcerns(c.id, e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <span style={{ color: label }}>{c.label}</span>
                  </label>
                ))}
              </div>
              {formData.concerns.other && (
                <input 
                  type="text" 
                  placeholder="Please specify..." 
                  value={formData.otherConcernDetails} 
                  onChange={(e) => updateField('otherConcernDetails', e.target.value)} 
                  className="mt-3 w-full px-4 py-3 outline-none transition-colors border-b-2 focus:border-amber-600"
                  style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
                />
              )}
            </div>
            <div className="border-t pt-6" style={{ borderColor: inputBorder }}>
              <label className="flex gap-3">
                <input type="checkbox" checked={formData.agreedToTerms} onChange={(e) => updateField('agreedToTerms', e.target.checked)} className="w-4 h-4 mt-0.5" />
                <span className="text-sm" style={{ color: subtext }}>
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="underline hover:opacity-80 transition-opacity" style={{ color: '#d97706', cursor: 'pointer' }}>
                    terms and conditions
                  </button>
                  {' '}<span className="text-red-600">*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && success && (
          <div className="text-center py-12">
            <CheckCircle2 />
            <h3 className="text-2xl font-bold mb-2" style={{ color: text }}>Application Submitted!</h3>
            <p className="mb-8" style={{ color: subtext }}>Thank you for your application. We'll review it and get back to you soon.</p>
            <button 
              onClick={() => navigate('/our-pets')} 
              className="px-6 py-3 rounded-full font-semibold transition-colors"
              style={{ backgroundColor: '#d97706', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
            >
              Back to Browse Pets
            </button>
          </div>
        )}

        {currentStep < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: inputBorder }}>
            <button 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
              className="px-6 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                borderColor: inputBorder, 
                color: label,
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'transparent'
              }}
            >
              ← Previous
            </button>
            {currentStep < 3 ? (
              <button 
                onClick={handleNext} 
                className="px-6 py-2 rounded-full font-semibold transition-colors"
                style={{ backgroundColor: '#d97706', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
              >
                Next →
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="px-6 py-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#d97706', color: 'white' }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#b45309')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#d97706')}
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