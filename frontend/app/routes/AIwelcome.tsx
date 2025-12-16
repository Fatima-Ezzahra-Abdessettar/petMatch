import { Link } from "react-router";
import { useAuth } from "../contexts/auth";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import React, { useState } from "react";
import { useTheme } from "~/contexts/themeContext";
import { motion } from "framer-motion";

export default function WelcomeUser() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle AI match submission
    console.log("Pet description:", description);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Smooth scroll to AI match section
  const scrollToAIMatch = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("AIpetMatch");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AuthenticatedLayout>
      <div 
        className="min-h-screen duration-300"
        style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
      >
        {/* Hero Section - Image 1 */}
        <section 
          className="relative overflow-hidden duration-300"
          style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
        >
          <div className="container mx-auto px-6 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Right side - Pet image (appears first on mobile) */}
              <div className="relative order-1 lg:order-2">
                <img 
                  src="catDog.png" 
                  alt="welcome"
                  className="w-full h-auto"
                  style={{
                    filter: isDarkMode
                      ? "drop-shadow(0 25px 50px rgba(217, 127, 62, 0.35))"
                      : "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.12))",
                  }}
                />
              </div>

              {/* Left side - Text content (appears second on mobile) */}
              <div className="space-y-6 order-2 lg:order-1">
                <h1 
                  className="text-5xl lg:text-6xl font-bold duration-300"
                  style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
                >
                  Welcome to<br />petMatch {user?.name} !
                </h1>
                <p 
                  className="text-lg lg:text-xl max-w-md duration-300"
                  style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                >
                  Share your preferences freely ! From specific traits to general vibes and our intelligent matching system will recommend the pets most compatible with you !
                </p>
                
                {/* Buttons container - centered on mobile, left-aligned on desktop */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4">
                  <motion.button
                    onClick={scrollToAIMatch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-[#D97F3E] text-white rounded-xl text-lg font-medium shadow-lg hover:bg-[#c17135] transition-colors"
                  >
                    AI match
                  </motion.button>
                  
                  <Link to="/pets-list" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-8 py-4 rounded-xl text-lg font-medium border-2 border-[#D97F3E] text-[#D97F3E] transition-colors duration-300"
                      style={{
                        backgroundColor: isDarkMode ? "#36332E" : "white",
                        boxShadow: isDarkMode
                          ? "0 10px 15px -3px rgba(217, 127, 62, 0.3)"
                          : "0 10px 15px -3px rgba(255, 237, 213, 0.5)",
                      }}
                    >
                      browse pets
                    </motion.button>
                  </Link>

                  {/* Dark Mode Toggle Button */}
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full hover:cursor-pointer w-12 h-12 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isDarkMode ? "#D9915B" : "#CCBFB1",
                    }}
                  >
                    {isDarkMode ? (
                      <i
                        className="ri-sun-line text-xl"
                        style={{ color: "#F7F5EA" }}
                      ></i>
                    ) : (
                      <i className="ri-moon-clear-line text-xl" style={{ color: "#6B5B4A" }}></i>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Matching Section - Image 2 */}
        <section 
          className="py-16 lg:py-24 duration-300"
          id="AIpetMatch"
          style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-4xl lg:text-5xl font-bold mb-6 duration-300"
                style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
              >
                AI matching
              </h2>

              {/* Cute dog illustration */}
              <div className="my-12">
                <div className="w-80 h-auto mx-auto flex items-center justify-center">
                  <img src="happyDog.png" alt="" />
                </div>
              </div>

              <p 
                className="text-lg lg:text-xl mb-12 max-w-2xl mx-auto duration-300"
                style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
              >
                Share your preferences freely ! From specific traits to general vibes and our intelligent matching system will recommend the pets most compatible with you ! 
              </p>

              {/* AI Matching Form */}
              <div 
                className="rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto duration-300"
                style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "white" }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="ex : I want a dog, that is pet friendly and not aggressive, ideally it would be nice if its a female ..."
                      rows={6}
                      className="w-full px-6 py-4 rounded-2xl border-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D97F3E] duration-300"
                      style={{
                        backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA",
                        borderColor: isDarkMode ? "#73655B" : "#e5e7eb",
                        color:"#1f2937",
                      }}
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="text-sm text-gray-400">💬 pets</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-8 py-4 bg-[#D97F3E] text-white rounded-xl text-lg font-medium shadow-lg hover:bg-[#c17135] transition-colors flex items-center justify-center gap-2"
                  >
                    Send description
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Inspiration Section - Image 3 */}
        <section 
          className="py-16 lg:py-24 relative duration-300"
          style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 
                className="text-4xl lg:text-5xl font-bold text-center mb-12 duration-300"
                style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
              >
                Need inspiration?
              </h2>

              {/* FAQ Accordions */}
              <div className="space-y-4 mb-16">
                {/* FAQ Item 1 */}
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.5)" : "white" }}
                >
                  <button
                    onClick={() => toggleFaq(1)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-opacity-90 transition-colors"
                  >
                    <span 
                      className="font-medium text-lg duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      Specify the species
                    </span>
                    <span 
                      className="text-2xl transition-transform duration-300"
                      style={{ 
                        color: "#D97F3E",
                        transform: openFaq === 1 ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {openFaq === 1 ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === 1 && (
                    <div 
                      className="px-6 pb-5 duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      <p>Dog or cat (or both!)</p>
                      <p>No preference? That's okay too</p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.5)" : "white" }}
                >
                  <button
                    onClick={() => toggleFaq(2)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-opacity-90 transition-colors"
                  >
                    <span 
                      className="font-medium text-lg duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      Specify the energy Level
                    </span>
                    <span 
                      className="text-2xl transition-transform duration-300"
                      style={{ 
                        color: "#D97F3E",
                        transform: openFaq === 2 ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {openFaq === 2 ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === 2 && (
                    <div 
                      className="px-6 pb-5 duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      <p>High energy, moderate, or low energy?</p>
                      <p>Think about your lifestyle and activity level</p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.5)" : "white" }}
                >
                  <button
                    onClick={() => toggleFaq(3)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-opacity-90 transition-colors"
                  >
                    <span 
                      className="font-medium text-lg duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      Describe your living Situation
                    </span>
                    <span 
                      className="text-2xl transition-transform duration-300"
                      style={{ 
                        color: "#D97F3E",
                        transform: openFaq === 3 ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {openFaq === 3 ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === 3 && (
                    <div 
                      className="px-6 pb-5 duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      <p>Apartment or house? With or without a yard?</p>
                      <p>Space matters for your pet's comfort</p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 4 */}
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.5)" : "white" }}
                >
                  <button
                    onClick={() => toggleFaq(4)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-opacity-90 transition-colors"
                  >
                    <span 
                      className="font-medium text-lg duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      Living Situation
                    </span>
                    <span 
                      className="text-2xl transition-transform duration-300"
                      style={{ 
                        color: "#D97F3E",
                        transform: openFaq === 4 ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      {openFaq === 4 ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === 4 && (
                    <div 
                      className="px-6 pb-5 duration-300"
                      style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}
                    >
                      <p>Do you have other pets or children?</p>
                      <p>Consider compatibility with your household</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cute dog illustrations at bottom */}
              <div className="flex justify-center items-end gap-8 mt-16">
                <img src="robotPets.png" alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}