import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FormData {
  name: string;
  surname: string;
  email: string;
  message: string;
}

interface FormTouched {
  name: boolean;
  surname: boolean;
  email: boolean;
  message: boolean;
}

interface Status {
  type: 'success' | 'error' | '';
  message: string;
}

type FormField = keyof FormData;

// Mock theme context - replace with your actual useTheme hook
const isDarkMode = false; // Change this to test dark mode

export default function ContactPage(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    surname: false,
    email: false,
    message: false
  });

  useEffect(() => {
    if (status.type === 'success') {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBlur = (field: FormField) => {
    setTouched({
      ...touched,
      [field]: true
    });
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFieldError = (field: FormField): string => {
    if (!touched[field]) return '';
    
    if (!formData[field]) {
      return 'This field is required';
    }
    
    if (field === 'email' && !isValidEmail(formData[field])) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };

  const isFormValid = (): boolean => {
    return formData.name.trim() !== '' && 
           formData.surname.trim() !== '' && 
           formData.email.trim() !== '' && 
           isValidEmail(formData.email) && 
           formData.message.trim() !== '';
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    setTouched({
      name: true,
      surname: true,
      email: true,
      message: true
    });

    if (!isFormValid()) {
      setStatus({
        type: 'error',
        message: 'Please fill in all fields correctly.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'ea8b63de-d97f-410a-b6a0-c47c1b3164d9',
          name: `${formData.name} ${formData.surname}`,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Form Submission from PetMatch'
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Thank you for reaching out! We\'ll get back to you soon.'
        });
        setFormData({ name: '', surname: '', email: '', message: '' });
        setTouched({ name: false, surname: false, email: false, message: false });
      } else {
        setStatus({
          type: 'error',
          message: 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status.type === 'success') {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
    <style>{`
      input::placeholder,
      textarea::placeholder {
        color: ${isDarkMode ? '#928e85' : '#9ca3af'};
        opacity: 0.7;
      }
    `}</style>
    <div 
      className="min-h-screen duration-300"
    >
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start max-w-7xl mx-auto">
          {/* Left Side - Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] lg:h-[800px] order-1">
            <img 
              src="https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Adorable dog with glasses"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 text-white">
                <h1 className="text-4xl lg:text-6xl font-bold mb-3 lg:mb-4 drop-shadow-lg">Get in touch</h1>
                <p className="text-lg lg:text-xl text-gray-100 drop-shadow-md">We'd love to hear from you and your furry friends!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div 
            className="rounded-3xl shadow-2xl p-6 lg:p-10 h-auto lg:h-[800px] flex flex-col order-2 transition-colors duration-300"
            style={{ 
              backgroundColor: isDarkMode ? 'rgb(115,101,91,0.5)' : 'rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 
                className="text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: isDarkMode ? '#FFFFFF' : '#36332E' }}
              >
                Contact PetMatch
              </h2>
              <p 
                className="text-sm lg:text-base"
                style={{ color: isDarkMode ? '#FFFFFF' : '#6b7280' }}
              >
                We typically respond within 24 hours
              </p>
            </div>

            {/* Status Message with fixed height */}
            <div className="min-h-[72px] mb-4">
              {status.message && (
                <div 
                  className="p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{
                    backgroundColor: status.type === 'success'
                      ? (isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5')
                      : (isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'),
                    border: `2px solid ${
                      status.type === 'success'
                        ? (isDarkMode ? 'rgba(16, 185, 129, 0.3)' : '#6ee7b7')
                        : (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fecaca')
                    }`,
                    color: status.type === 'success'
                      ? (isDarkMode ? '#6ee7b7' : '#065f46')
                      : (isDarkMode ? '#fca5a5' : '#b91c1c')
                  }}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium flex-1">{status.message}</p>
                  <button 
                    onClick={() => setStatus({ type: '', message: '' })}
                    className="text-current hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Form Container with scroll */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-5">
                {/* Name and Surname Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-3 pointer-events-none">
                        <User 
                          className="w-5 h-5"
                          style={{ color: isDarkMode ? '#928e85' : '#9ca3af' }}
                        />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="Ahmed"
                        className="w-full pl-12 pr-4 py-3 border-b-2 bg-transparent focus:outline-none transition-all"
                        style={{
                          borderBottomColor: getFieldError('name') 
                            ? (isDarkMode ? '#dc2626' : '#ef4444')
                            : (isDarkMode ? '#928e85' : '#d1d5db'),
                          color: isDarkMode ? '#F7F5EA' : '#36332E'
                        }}
                        onFocus={(e) => {
                          if (!getFieldError('name')) {
                            e.currentTarget.style.borderBottomColor = '#d97706';
                          }
                        }}
                      />
                      {getFieldError('name') && (
                        <p 
                          className="mt-1.5 text-xs font-medium"
                          style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}
                        >
                          {getFieldError('name')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Surname Field */}
                  <div>
                    <label 
                      htmlFor="surname" 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-3 pointer-events-none">
                        <User 
                          className="w-5 h-5"
                          style={{ color: isDarkMode ? '#928e85' : '#9ca3af' }}
                        />
                      </div>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        onBlur={() => handleBlur('surname')}
                        placeholder="Bennani"
                        className="w-full pl-12 pr-4 py-3 border-b-2 bg-transparent focus:outline-none transition-all"
                        style={{
                          borderBottomColor: getFieldError('surname') 
                            ? (isDarkMode ? '#dc2626' : '#ef4444')
                            : (isDarkMode ? '#928e85' : '#d1d5db'),
                          color: isDarkMode ? '#F7F5EA' : '#36332E'
                        }}
                        onFocus={(e) => {
                          if (!getFieldError('surname')) {
                            e.currentTarget.style.borderBottomColor = '#d97706';
                          }
                        }}
                      />
                      {getFieldError('surname') && (
                        <p 
                          className="mt-1.5 text-xs font-medium"
                          style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}
                        >
                          {getFieldError('surname')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 pointer-events-none">
                      <Mail 
                        className="w-5 h-5"
                        style={{ color: isDarkMode ? '#928e85' : '#9ca3af' }}
                      />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="AhmedBennani@example.com"
                      className="w-full pl-12 pr-4 py-3 border-b-2 bg-transparent focus:outline-none transition-all"
                      style={{
                        borderBottomColor: getFieldError('email') 
                          ? (isDarkMode ? '#dc2626' : '#ef4444')
                          : (isDarkMode ? '#928e85' : '#d1d5db'),
                        color: isDarkMode ? '#F7F5EA' : '#36332E'
                      }}
                      onFocus={(e) => {
                        if (!getFieldError('email')) {
                          e.currentTarget.style.borderBottomColor = '#d97706';
                        }
                      }}
                    />
                    {getFieldError('email') && (
                      <p 
                        className="mt-1.5 text-xs font-medium"
                        style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}
                      >
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 pointer-events-none">
                      <MessageSquare 
                        className="w-5 h-5"
                        style={{ color: isDarkMode ? '#928e85' : '#9ca3af' }}
                      />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help you and your pet..."
                      className="w-full pl-12 pr-4 py-3 border-b-2 bg-transparent focus:outline-none transition-all resize-none"
                      style={{
                        borderBottomColor: getFieldError('message') 
                          ? (isDarkMode ? '#dc2626' : '#ef4444')
                          : (isDarkMode ? '#928e85' : '#d1d5db'),
                          color: isDarkMode ? '#F7F5EA' : '#36332E'

                      }}
                      onFocus={(e) => {
                        if (!getFieldError('message')) {
                          (e.target as HTMLTextAreaElement).style.borderBottomColor = '#d97706';
                        }
                      }}
                      onBlur={(e) => {
                        handleBlur('message');
                        if (!getFieldError('message')) {
                          (e.target as HTMLTextAreaElement).style.borderBottomColor = isDarkMode ? '#928e85' : '#d1d5db';
                        }
                      }}
                    />
                    {getFieldError('message') && (
                      <p 
                        className="mt-1.5 text-xs font-medium"
                        style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}
                      >
                        {getFieldError('message')}
                      </p>
                    )}
                  </div>
                  <p 
                    className="mt-2 text-xs"
                    style={{ color: isDarkMode ? '#928e85' : '#6b7280' }}
                  >
                    {formData.message.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#d97706',
                    color: '#F7F5EA'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#b45309';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#d97706';
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p 
                  className="text-xs text-center pt-2"
                  style={{ color: isDarkMode ? '#928e85' : '#6b7280' }}
                >
                  By submitting this form, you agree to our privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}