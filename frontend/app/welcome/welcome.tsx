import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTheme } from "~/contexts/themeContext";
import { useQuery } from "@tanstack/react-query";
import api from "~/api/client";
import axios from "axios";
import type { Pet } from "~/api/petsService";
import PetCard from "~/components/petCard";

export default function Welcome() {
  const { isDarkMode } = useTheme();

  const getPets = async (): Promise<Pet[]> => {
    try {
      console.log("🔍 ENV VAR:", import.meta.env.VITE_API_URL);
      console.log("🔍 Axios baseURL:", api.defaults.baseURL);
      console.log("🔍 Making request to:", `${api.defaults.baseURL}/api/pets`);
      console.log("🔍 API Base URL:", api.defaults.baseURL);
      console.log("🔍 Full URL:", `${api.defaults.baseURL}/api/pets`);

      const res = await api.get("/api/pets");
      console.log("✅ API Response SUCCESS:", res.data);
      console.log("Type of res.data:", typeof res.data);
      console.log("res.data.pets:", res.data.pets);

      if (Array.isArray(res.data)) {
        console.log("✅ Response is array directly");
        return res.data;
      } else if (res.data.pets && Array.isArray(res.data.pets)) {
        console.log("✅ Response has pets property");
        return res.data.pets;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        console.log("✅ Response has data property");
        return res.data.data;
      }

      console.error("❌ Unexpected response structure:", res.data);
      throw new Error("Invalid API response structure");
    } catch (err: any) {
      console.error("❌ API Error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error Response:", err.response?.data);
        console.error("Error Status:", err.response?.status);
        console.error("Error Message:", err.message);
      }
      throw err;
    }
  };

  const { data, isLoading, error } = useQuery<Pet[]>({
    queryKey: ["pets"],
    queryFn: getPets,
  });

  const pets = data?.slice(0, 6) || [];

  const reviews = [
    {
      name: "Julia Madison",
      country: "Allemagne",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      title: "Une expérience incroyable !",
      text: "J'ai adopté un petit chaton grâce à l'application et tout s'est passé très facilement. Les fiches des animaux sont claires, et l'équipe m'a vraiment bien guidée. Je recommande à 100 % !",
    },
    {
      name: "Nada Alaoui",
      country: "Morocco",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      title: "Merci pour cette belle plateforme",
      text: "Grâce à l'application, j'ai pu donner une seconde chance à une chatte abandonnée. Le suivi après adoption est très utile. Continuez comme ça !",
    },
    {
      name: "Lucia Damon",
      country: "Spain",
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
      title: "Très pratique mais peut être améliorée",
      text: "L'app m'a permis de trouver rapidement un chien correspondant à mon mode de vie. J'ai juste trouvé que la vérification prenait un peu trop de temps. Sinon, super idée !!",
    },
    {
      name: "John Doe",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      title: "Amazing experience!",
      text: "I adopted a wonderful dog through this platform. The process was smooth and the team was very helpful. Highly recommend!",
    },
    {
      name: "Maria Garcia",
      country: "Mexico",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      title: "Excelente servicio",
      text: "Encontré a mi compañero perfecto aquí. La aplicación es fácil de usar y el proceso de adopción fue rápido. ¡Gracias!",
    },
    {
      name: "Pierre Dubois",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      title: "Parfait pour les familles",
      text: "Nous avons adopté un chien adorable pour nos enfants. Le processus était simple et l'équipe nous a bien accompagnés. Une plateforme à recommander !",
    },
    {
      name: "Ahmed Hassan",
      country: "Egypt",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      title: "Life-changing experience",
      text: "Pet Match helped me find my perfect companion. The matching process was spot on, and the support team was amazing throughout. My new dog has brought so much joy to my life!",
    },
  ];

  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <main className="relative">
        {/* Hero Section with gradient background */}
        <div className="relative min-h-[85vh] flex items-center">
          {/* Animated gradient background */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle at 20% 50%, rgba(217, 127, 62, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 127, 62, 0.1) 0%, transparent 50%)"
                  : "radial-gradient(circle at 20% 50%, rgba(255, 237, 213, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 237, 213, 0.3) 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center justify-between">
              {/* Left Content */}
              <motion.div
                className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col gap-4 lg:gap-6">
                  <motion.h1
                    className="font-playfair leading-tight
                      text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 
                      transition-colors duration-300"
                    style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Perfect pet companion
                  </motion.h1>

                  <motion.p
                    className="font-raleway text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 
                      max-w-2xl transition-colors duration-300 leading-relaxed"
                    style={{ color: isDarkMode ? "#F7F5EA" : "#36332E" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Connect with loving animals from trusted shelters worldwide
                  </motion.p>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-8 w-full sm:w-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="w-full sm:w-auto"
                    >
                      <Link to="/register" className="block w-full sm:w-auto">
                        <button
                          className="w-full sm:w-auto bg-btnPrimary px-8 lg:px-12 xl:px-16 py-3.5 lg:py-4 
                          text-BgLight text-lg font-medium rounded-xl 
                          hover:bg-[#cb763a] active:bg-[#b26228] 
                          transform hover:scale-105 active:scale-95
                          transition-all duration-200 
                          shadow-lg hover:shadow-xl"
                        >
                          GET STARTED !
                        </button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="w-full sm:w-auto"
                    >
                      <Link to={"/our-pets"} className="block w-full sm:w-auto">
                        <button
                          className="w-full sm:w-auto px-8 lg:px-12 xl:px-16 py-3.5 lg:py-4 
                            border-2 border-btnPrimary text-btnPrimary text-lg font-medium rounded-xl
                            transform hover:scale-105 active:scale-95
                            transition-all duration-200"
                          style={{
                            backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA",
                            boxShadow: isDarkMode
                              ? "0 10px 15px -3px rgba(217, 127, 62, 0.3)"
                              : "0 10px 15px -3px rgba(255, 237, 213, 0.5)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = isDarkMode
                              ? "0 20px 25px -5px rgba(217, 127, 62, 0.5)"
                              : "0 20px 25px -5px rgba(255, 237, 213, 0.8)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = isDarkMode
                              ? "0 10px 15px -3px rgba(217, 127, 62, 0.3)"
                              : "0 10px 15px -3px rgba(255, 237, 213, 0.5)";
                          }}
                        >
                          browse pets
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="flex-1 flex justify-center items-center w-full max-w-2xl"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src="/catDog.png"
                  alt="petMatch"
                  className="w-full h-auto max-w-md lg:max-w-xl xl:max-w-2xl"
                  style={{
                    filter: isDarkMode
                      ? "drop-shadow(0 25px 50px rgba(217, 127, 62, 0.35))"
                      : "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.12))",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair text-center mb-12 lg:mb-20 
              transition-colors duration-300"
            style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            About us
          </motion.h2>

          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="/aboutUsImg.png"
              alt="about us"
              className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto rounded-3xl"
              style={{
                filter: isDarkMode
                  ? "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))"
                  : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            <motion.div
              className="font-raleway text-xl lg:text-2xl xl:text-3xl max-w-2xl text-center lg:text-left 
                leading-relaxed transition-colors duration-300"
              style={{ color: isDarkMode ? "#F7F5EA" : "#36332E" }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              At Pet Match, we believe every pet deserves a loving home and
              every family deserves the perfect companion.
              <br />
              <br />
              Our advanced matching algorithm considers personality, lifestyle,
              living situation, and preferences to create meaningful
              connections.
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1623583402451-ed5ddce2f3d5?w=600&h=800&fit=crop"
                alt="Volunteer with pet"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
                flex flex-col items-center justify-center text-white"
              >
                <h3 className="text-7xl lg:text-8xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  100+
                </h3>
                <p className="text-3xl lg:text-4xl font-light">volunteers</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&h=800&fit=crop"
                alt="Veterinarian"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
                flex flex-col items-center justify-center text-white"
              >
                <h3 className="text-7xl lg:text-8xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  30+
                </h3>
                <p className="text-3xl lg:text-4xl font-light">vets</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop"
                alt="Happy pets"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
                flex flex-col items-center justify-center text-white"
              >
                <h3 className="text-7xl lg:text-8xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  1500+
                </h3>
                <p className="text-3xl lg:text-4xl font-light">pets</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Pets Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-12 lg:mb-16"
            style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
          >
            Our pets
          </h2>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentPetIndex * (100 / visibleCount)}%)`,
                }}
              >
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <PetCard props={pet} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                setCurrentPetIndex(Math.max(0, currentPetIndex - 1))
              }
              disabled={currentPetIndex === 0}
              className={`absolute -left-6 lg:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full 
                ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
                shadow-xl flex items-center justify-center transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
                hidden md:flex`}
            >
              <svg
                className="w-6 h-6 lg:w-8 lg:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                setCurrentPetIndex(
                  Math.min(pets.length - visibleCount, currentPetIndex + 1)
                )
              }
              disabled={currentPetIndex >= pets.length - visibleCount}
              className={`absolute -right-6 lg:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full 
                ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
                shadow-xl flex items-center justify-center transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
                hidden md:flex`}
            >
              <svg
                className="w-6 h-6 lg:w-8 lg:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(Math.max(0, pets.length - visibleCount + 1))].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPetIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentPetIndex === index
                        ? "bg-[#D97F3E] w-8"
                        : isDarkMode
                          ? "bg-gray-600 w-3"
                          : "bg-gray-300 w-3"
                    }`}
                  />
                )
              )}
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden w-full max-w-md h-[450px] group cursor-pointer"
              style={{
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
                  : "0 25px 50px -12px rgba(163, 163, 163, 0.4)",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/locked-pet.jpg')`,
                  filter: "blur(3px)",
                  transform: "scale(1.1)",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-6 animate-bounce">🔒</div>

                <h2 className="font-playfair text-3xl text-white mb-4">
                  More Pets Waiting
                </h2>

                <p className="text-white/90 text-lg mb-8 max-w-xs">
                  Discover hundreds of adorable companions ready to find their
                  forever homes
                </p>

                <Link to="/our-pets">
                  <button
                    className="px-10 py-4 bg-[#D97F3E] hover:bg-[#c17135] text-white rounded-full 
                    text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl
                    transform hover:scale-105 active:scale-95"
                  >
                    Browse All Pets
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-12 lg:mb-16"
            style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
          >
            Reviews
          </h2>

          <div className="relative max-w-6xl mx-auto">
            {visibleCount === 1 ? (
              <div className="flex overflow-x-auto gap-6 pb-4">
                {reviews.map((review, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`${isDarkMode ? "#73655B" : "bg-white"}
                        rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300
                        transform hover:-translate-y-2`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-[#D97F3E]/20"
                        />
                        <div>
                          <h4 className="font-semibold text-lg lg:text-xl">
                            {review.name}
                          </h4>
                          <p
                            className={`text-sm lg:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {review.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-2xl">
                            ⭐
                          </span>
                        ))}
                      </div>

                      <p className="font-semibold text-lg mb-3">
                        "{review.title}"
                      </p>
                      <p
                        className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {review.text}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews
                  .slice(currentReviewIndex, currentReviewIndex + visibleCount)
                  .map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`${isDarkMode ? "bg-[#73655B]" : "bg-white"}
                      rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300
                      transform hover:-translate-y-2`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-[#D97F3E]/20"
                        />
                        <div>
                          <h4 className="font-semibold text-lg lg:text-xl">
                            {review.name}
                          </h4>
                          <p
                            className={`text-sm lg:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {review.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-2xl">
                            ⭐
                          </span>
                        ))}
                      </div>

                      <p className="font-semibold text-lg mb-3">
                        "{review.title}"
                      </p>
                      <p
                        className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {review.text}
                      </p>
                    </motion.div>
                  ))}
              </div>
            )}

            {visibleCount > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentReviewIndex(
                      currentReviewIndex === 0
                        ? reviews.length - visibleCount
                        : currentReviewIndex - visibleCount
                    )
                  }
                  className={`absolute -left-6 lg:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full
                    ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}
                    shadow-xl flex items-center justify-center transition-all duration-300
                    hover:scale-110 active:scale-95 flex`}
                >
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    setCurrentReviewIndex(
                      currentReviewIndex >= reviews.length - visibleCount
                        ? 0
                        : currentReviewIndex + visibleCount
                    )
                  }
                  className={`absolute -right-6 lg:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full
                    ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}
                    shadow-xl flex items-center justify-center transition-all duration-300
                    hover:scale-110 active:scale-95 flex`}
                >
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className={`py-16 lg:py-24 ${isDarkMode ? "bg-[#36332E]" : "bg-[#F7F5EA]"} transition-colors duration-300`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-12 lg:mb-16"
            style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
          >
            FAQ
          </h2>

          <div className="space-y-4">
            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Comment fonctionne le processus d'adoption ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Créez un compte, parcourez les animaux disponibles, soumettez
                une demande d'adoption, et notre équipe vous contactera pour
                finaliser le processus. Tout est fait en ligne pour votre
                confort !
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                L'adoption est-elle gratuite ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Oui, l'adoption est entièrement gratuite. Cependant, certains
                refuges peuvent demander une contribution volontaire pour
                couvrir les frais de vaccination et de stérilisation.
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
              open
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Quels animaux sont disponibles ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▲
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Chiens et chats. La liste est mise à jour régulièrement via le
                système :)
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Comment puis-je être sûr que l'animal est encore disponible ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Notre système met à jour en temps réel la disponibilité des
                animaux. Si un animal est marqué comme disponible, il l'est
                effectivement au moment de votre consultation.
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Comment créer un compte ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Cliquez sur "S'inscrire" en haut de la page, remplissez le
                formulaire avec vos informations personnelles, et validez votre
                email. C'est rapide et gratuit !
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Dois-je avoir un compte pour adopter ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Oui, un compte est nécessaire pour soumettre une demande
                d'adoption. Cela nous permet de mieux vous connaître et
                d'assurer un processus d'adoption responsable.
              </p>
            </details>

            <details
              className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
              rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg`}
            >
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Qui peut ajouter de nouveaux animaux ?
                <span className="text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p
                className={`mt-4 leading-relaxed text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Seuls les refuges et organisations partenaires peuvent ajouter
                de nouveaux animaux à la plateforme. Cela garantit la fiabilité
                des informations et la sécurité des animaux.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: isDarkMode
                ? "radial-gradient(circle at 50% 50%, rgba(217, 127, 62, 0.2) 0%, transparent 70%)"
                : "radial-gradient(circle at 50% 50%, rgba(255, 237, 213, 0.5) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-8"
            style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
          >
            Ready to adopt your new companion?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/register">
              <button
                className="px-12 py-5 bg-[#D97F3E] hover:bg-[#c17135] text-white rounded-full 
                text-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl
                transform hover:scale-105 active:scale-95"
              >
                Sign Up Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-[rgb(115,101,91,0.5)]" : "bg-[rgba(204,191,177,0.3)]"
        } py-12 lg:py-16 transition-colors duration-300`}
      >
        <div className="w-full px-4 sm:px-8 xl:px-16 2xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h3
                className="font-semibold text-xl lg:text-2xl mb-6"
                style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
              >
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1">✉️</span>
                  <div
                    className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <p className="text-lg">contact@petMatch.org</p>
                    <p className="text-lg">support@petMatch.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📞</span>
                  <p
                    className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    +212 562-524789
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1">📍</span>
                  <p
                    className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Iberia, Tanger, Maroc
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3
                className="font-semibold text-xl lg:text-2xl mb-6"
                style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
              >
                Follow Us
              </h3>
              <p
                className={`mb-6 text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Stay connected with us on social media for the latest updates
                and news
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full 
                  ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
                  flex items-center justify-center transition-all duration-300 shadow-md
                  hover:scale-110 hover:shadow-lg`}
                >
                  <span className="text-xl lg:text-2xl">f</span>
                </a>
                <a
                  href="#"
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full 
                  ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
                  flex items-center justify-center transition-all duration-300 shadow-md
                  hover:scale-110 hover:shadow-lg`}
                >
                  <span className="text-xl lg:text-2xl">𝕏</span>
                </a>
                <a
                  href="#"
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full 
                  ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
                  flex items-center justify-center transition-all duration-300 shadow-md
                  hover:scale-110 hover:shadow-lg`}
                >
                  <span className="text-xl lg:text-2xl">📷</span>
                </a>
                <a
                  href="#"
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full 
                  ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
                  flex items-center justify-center transition-all duration-300 shadow-md
                  hover:scale-110 hover:shadow-lg`}
                >
                  <span className="text-xl lg:text-2xl">in</span>
                </a>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 pt-8 border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"} text-center`}
          >
            <p
              className={`text-base lg:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              © 2025 petMatch - All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
