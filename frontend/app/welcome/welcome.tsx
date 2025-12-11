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
      const res = await api.get("/api/pets");
      
      if (Array.isArray(res.data)) {
        return res.data;
      } else if (res.data.pets && Array.isArray(res.data.pets)) {
        return res.data.pets;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }

      throw new Error("Invalid API response structure");
    } catch (err: any) {
      console.error("API Error:", err);
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
      name: "Saphia Madou",
      country: "CasaBlanca",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      title: "Une expérience incroyable !",
      text: "J'ai adopté un petit chaton grâce à l'application et tout s'est passé très facilement. Les fiches des animaux sont claires, et l'équipe m'a vraiment bien guidée.",
    },
    {
      name: "Nada Alaoui",
      country: "Rabat",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      title: "Merci pour cette belle plateforme",
      text: "Grâce à l'application, j'ai pu donner une seconde chance à une chatte abandonnée. Le suivi après adoption est très utile.",
    },
    {
      name: "Jihane Damon",
      country: "Rabat",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
      title: "Très pratique",
      text: "L'app m'a permis de trouver rapidement un chien correspondant à mon mode de vie. Super idée !",
    },
    {
      name: "Ahmed bennani",
      country: "Oujda",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      title: "Amazing experience!",
      text: "I adopted a wonderful dog through this platform. The process was smooth and the team was very helpful.",
    },
    {
      name: "Maria Abdelmoumen",
      country: "Tangier",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      title: "Excelente servicio",
      text: "Encontré a mi compañero perfecto aquí. La aplicación es fácil de usar y el proceso de adopción fue rápido.",
    },
    {
      name: "Mohammed Addou",
      country: "Guelmim",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      title: "Parfait pour les familles",
      text: "Nous avons adopté un chien adorable pour nos enfants. Le processus était simple et l'équipe nous a bien accompagnés.",
    },
    {
      name: "Ahmed Hassan",
      country: "Tetouan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      title: "Life-changing experience",
      text: "Pet Match helped me find my perfect companion. The matching process was spot on, and my new dog has brought so much joy!",
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
    <div className="w-full overflow-x-hidden">
      <main className="relative w-full">
        {/* Hero Section */}
        <div className="duration-300 w-full">
          <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-15 lg:py-17">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <motion.div
                className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-4 sm:space-y-6 w-full max-w-2xl lg:max-w-none">
                  <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair leading-tight transition-colors duration-300"
                    style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Perfect pet companion
                  </motion.h1>

                  <motion.p
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-raleway leading-relaxed transition-colors duration-300"
                    style={{ color: isDarkMode ? "#F7F5EA" : "#36332E" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Connect with loving animals from trusted shelters worldwide
                  </motion.p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="w-full sm:w-auto"
                    >
                      <Link to="/register" className="block w-full sm:w-auto">
                        <button
                          className="w-full sm:w-auto bg-btnPrimary px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5
                    text-BgLight text-base sm:text-lg font-medium rounded-xl 
                    hover:bg-[#cb763a] active:bg-[#b26228] 
                    transform hover:scale-105 active:scale-95
                    transition-all duration-200 
                    shadow-lg hover:shadow-xl"
                        >
                          GET STARTED!
                        </button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="w-full sm:w-auto"
                    >
                      <Link to="/our-pets" className="block w-full sm:w-auto">
                        <button
                          className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5
                      border-2 border-btnPrimary text-btnPrimary text-base sm:text-lg font-medium rounded-xl
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200"
                          style={{
                            backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA",
                            boxShadow: isDarkMode
                              ? "0 10px 15px -3px rgba(217, 127, 62, 0.3)"
                              : "0 10px 15px -3px rgba(255, 237, 213, 0.5)",
                          }}
                        >
                          Browse Pets
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="flex justify-center items-center order-1 lg:order-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src="/catDog.png"
                  alt="petMatch"
                  className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
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
      <section id="about" className="duration-300 w-full py-2 sm:py-5 lg:py-7">
        <div className="container mx-auto px-4 sm:px-6 ">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-8 sm:mb-12 lg:mb-16 
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
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.img
                src="/aboutUsImg.png"
                alt="about us"
                className="w-full h-auto rounded-2xl sm:rounded-3xl order-1"
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
                className="font-raleway text-base sm:text-lg md:text-xl lg:text-2xl text-center lg:text-left 
            leading-relaxed transition-colors duration-300 order-2"
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
                Our advanced matching algorithm considers personality,
                lifestyle, living situation, and preferences to create
                meaningful connections.
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="duration-300 w-full py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-96 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1623583402451-ed5ddce2f3d5?w=600&h=800&fit=crop"
                  alt="Volunteer with pet"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
            flex flex-col items-center justify-center text-white">
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    100+
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-light">volunteers</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-96 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&h=800&fit=crop"
                  alt="Veterinarian"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
            flex flex-col items-center justify-center text-white">
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    30+
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-light">vets</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-96 group cursor-pointer sm:col-span-2 lg:col-span-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop"
                  alt="Happy pets"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D97F3E]/95 via-[#D97F3E]/60 to-transparent 
            flex flex-col items-center justify-center text-white">
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    1500+
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-light">pets</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Pets Section */}
      <section className=" duration-300 w-full sm:py-2 lg:py-3">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-14">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-8 sm:mb-12 lg:mb-16"
              style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
            >
              Our pets
            </h2>

            <div className="relative max-w-7xl mx-auto">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPetIndex * (100 / visibleCount)}%)`,
                  }}
                >
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      <PetCard props={pet} />
                    </div>
                  ))}

                  {/* Discover More Pets Card */}
                  <div
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="relative rounded-2xl overflow-hidden w-full h-full min-h-[320px] sm:min-h-[350px] group cursor-pointer"
                      style={{
                        boxShadow: isDarkMode
                          ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
                          : "0 25px 50px -12px rgba(163, 163, 163, 0.4)",
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?w=600&h=800&fit=crop')`,
                          filter: "blur(3px)",
                          transform: "scale(1.1)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-4xl sm:text-5xl mb-4 animate-bounce">🔒</div>
                        <h2 className="font-playfair text-xl sm:text-2xl text-white mb-3">
                          More Pets Waiting
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base mb-6 max-w-xs px-2">
                          Discover hundreds of adorable companions ready to find their forever homes
                        </p>
                        <Link to="/our-pets">
                          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#D97F3E] hover:bg-[#c17135] text-white rounded-full 
                text-sm sm:text-base font-medium transition-all duration-300 shadow-xl hover:shadow-2xl
                transform hover:scale-105 active:scale-95">
                            Browse All Pets
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Hidden on mobile */}
              <button
                onClick={() => setCurrentPetIndex(Math.max(0, currentPetIndex - 1))}
                disabled={currentPetIndex === 0}
                className={`absolute -left-4 lg:-left-16 top-1/2 -translate-y-1/2 
            w-10 h-10 lg:w-14 lg:h-14 rounded-full 
            ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
            shadow-xl flex items-center justify-center transition-all duration-300
            disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
            hidden sm:flex z-10`}
              >
                <svg className="w-5 h-5 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() =>
                  setCurrentPetIndex(Math.min(pets.length + 1 - visibleCount, currentPetIndex + 1))
                }
                disabled={currentPetIndex >= pets.length + 1 - visibleCount}
                className={`absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 
            w-10 h-10 lg:w-14 lg:h-14 rounded-full 
            ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
            shadow-xl flex items-center justify-center transition-all duration-300
            disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
            hidden sm:flex z-10`}
              >
                <svg className="w-5 h-5 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Pagination Dots */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {[...Array(Math.max(0, pets.length + 1 - visibleCount + 1))].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPetIndex(index)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                      currentPetIndex === index
                        ? "bg-[#D97F3E] w-6 sm:w-8"
                        : isDarkMode
                          ? "bg-gray-600 w-2 sm:w-2.5"
                          : "bg-gray-300 w-2 sm:w-2.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section id="reviews" className="duration-300">
        <div className="container mx-auto px-10 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-4xl lg:text-6xl font-playfair text-center mb-8 lg:mb-16"
              style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
            >
              What Our Adopters Say
            </h2>

            <div className="relative max-w-7xl mx-14">
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentReviewIndex * (100 / visibleCount)}%)`,
                  }}
                >
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 px-2 md:px-3"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      <div
                        className="rounded-2xl p-4 md:p-6 lg:p-8 h-full min-h-[320px] md:min-h-[350px] flex flex-col transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: isDarkMode
                            ? "rgba(115, 101, 91, 0.3)"
                            : "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        {/* Header with avatar and info */}
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <img
                            src={review.image}
                            alt={review.name}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-4"
                            style={{
                              borderColor: "#D97F3E",
                            }}
                          />
                          <div>
                            <h3
                              className="font-bold text-base md:text-lg"
                              style={{
                                color: isDarkMode ? "#F7F5EA" : "#36332E",
                              }}
                            >
                              {review.name}
                            </h3>
                            <p
                              className="text-xs md:text-sm"
                              style={{
                                color: isDarkMode ? "#928e85" : "#6b7280",
                              }}
                            >
                              {review.country}
                            </p>
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className="flex gap-1 mb-2 md:mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="#D97F3E"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review title */}
                        <h4
                          className="font-bold text-lg md:text-xl mb-2 md:mb-3"
                          style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
                        >
                          {review.title}
                        </h4>

                        {/* Review text */}
                        <p
                          className="text-sm md:text-base leading-relaxed flex-grow"
                          style={{ color: isDarkMode ? "#F7F5EA" : "#4b5563" }}
                        >
                          "{review.text}"
                        </p>

                        {/* Quote icon decoration */}
                        <div className="mt-3 md:mt-4 flex justify-end">
                          <svg
                            className="w-6 h-6 md:w-8 md:h-8 opacity-20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: "#D97F3E" }}
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() =>
                  setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))
                }
                disabled={currentReviewIndex === 0}
                className={`absolute -left-4 md:-left-6 lg:-left-20 top-1/2 -translate-y-1/2 
            w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full 
            ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
            shadow-xl flex items-center justify-center transition-all duration-300
            disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
            hidden md:flex z-10`}
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
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
                    Math.min(
                      reviews.length - visibleCount,
                      currentReviewIndex + 1
                    )
                  )
                }
                disabled={currentReviewIndex >= reviews.length - visibleCount}
                className={`absolute -right-4 md:-right-6 lg:-right-20 top-1/2 -translate-y-1/2 
            w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full 
            ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} 
            shadow-xl flex items-center justify-center transition-all duration-300
            disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95
            hidden md:flex z-10`}
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
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

              {/* Pagination Dots */}
              <div className="flex justify-center mt-6 md:mt-8 space-x-2">
                {[...Array(Math.max(0, reviews.length - visibleCount + 1))].map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReviewIndex(index)}
                      className={`h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                        currentReviewIndex === index
                          ? "bg-[#D97F3E] w-6 md:w-8"
                          : isDarkMode
                            ? "bg-gray-600 w-2.5 md:w-3"
                            : "bg-gray-300 w-2.5 md:w-3"
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="FAQ"
        className={`duration-300 ${isDarkMode ? "bg-[#36332E]" : "bg-[#F7F5EA]"}`}
      >
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl lg:text-6xl font-playfair text-center mb-8 lg:mb-16"
              style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
            >
              FAQ
            </h2>

            <div className="space-y-3 md:space-y-4">
              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Comment fonctionne le processus d'adoption ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Créez un compte, parcourez les animaux disponibles, soumettez
                  une demande d'adoption, et notre équipe vous contactera pour
                  finaliser le processus. Tout est fait en ligne pour votre
                  confort !
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>L'adoption est-elle gratuite ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Oui, l'adoption est entièrement gratuite. Cependant, certains
                  refuges peuvent demander une contribution volontaire pour
                  couvrir les frais de vaccination et de stérilisation.
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
                open
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Quels animaux sont disponibles ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▲
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Chiens et chats. La liste est mise à jour régulièrement via le
                  système :)
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>
                    Comment puis-je être sûr que l'animal est encore disponible
                    ?
                  </span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Notre système met à jour en temps réel la disponibilité des
                  animaux. Si un animal est marqué comme disponible, il l'est
                  effectivement au moment de votre consultation.
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Comment créer un compte ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Cliquez sur "S'inscrire" en haut de la page, remplissez le
                  formulaire avec vos informations personnelles, et validez
                  votre email. C'est rapide et gratuit !
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Dois-je avoir un compte pour adopter ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Oui, un compte est nécessaire pour soumettre une demande
                  d'adoption. Cela nous permet de mieux vous connaître et
                  d'assurer un processus d'adoption responsable.
                </p>
              </details>

              <details
                className={`${isDarkMode ? "bg-[#73655B]" : "bg-[#E8DCC4]"} 
          rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:shadow-lg`}
              >
                <summary className="font-medium text-base md:text-lg cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>Qui peut ajouter de nouveaux animaux ?</span>
                  <span className="text-xl md:text-2xl text-[#D97F3E] group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p
                  className={`mt-3 md:mt-4 leading-relaxed text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Seuls les refuges et organisations partenaires peuvent ajouter
                  de nouveaux animaux à la plateforme. Cela garantit la
                  fiabilité des informations et la sécurité des animaux.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="duration-300 relative overflow-hidden">
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

        <div className="container mx-auto px-4 py-0 lg:py-12">
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center justify-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-playfair font-bold mb-6 md:mb-8"
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
                  className="px-10 md:px-12 py-4 md:py-5 bg-[#D97F3E] hover:bg-[#c17135] text-white rounded-full 
            text-lg md:text-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl
            transform hover:scale-105 active:scale-95"
                >
                  Sign Up Now
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-[rgb(115,101,91,0.5)]" : "bg-[rgba(204,191,177,0.3)]"
        } duration-300`}
      >
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3
                  className="font-semibold text-lg md:text-xl lg:text-2xl mb-4 md:mb-6"
                  style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
                >
                  Contact Us
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="text-xl md:text-2xl mt-1">✉️</span>
                    <div
                      className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <p className="text-base md:text-lg">
                        contact@petMatch.org
                      </p>
                      <p className="text-base md:text-lg">
                        support@petMatch.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="text-xl md:text-2xl">📞</span>
                    <p
                      className={`text-base md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      +212 562-524789
                    </p>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="text-xl md:text-2xl mt-1">📍</span>
                    <p
                      className={`text-base md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Iberia, Tanger, Maroc
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className="font-semibold text-lg md:text-xl lg:text-2xl mb-4 md:mb-6"
                  style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
                >
                  Follow Us
                </h3>
                <p
                  className={`mb-4 md:mb-6 text-base md:text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Stay connected with us on social media for the latest updates
                  and news
                </p>
                <div className="flex gap-3 md:gap-4">
                  <a
                    href="#"
                    className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full 
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
              flex items-center justify-center transition-all duration-300 shadow-md
              hover:scale-110 hover:shadow-lg`}
                  >
                    <span className="text-lg md:text-xl lg:text-2xl">f</span>
                  </a>
                  <a
                    href="#"
                    className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full 
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
              flex items-center justify-center transition-all duration-300 shadow-md
              hover:scale-110 hover:shadow-lg`}
                  >
                    <span className="text-lg md:text-xl lg:text-2xl">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full 
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
              flex items-center justify-center transition-all duration-300 shadow-md
              hover:scale-110 hover:shadow-lg`}
                  >
                    <span className="text-lg md:text-xl lg:text-2xl">📷</span>
                  </a>
                  <a
                    href="#"
                    className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full 
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} 
              flex items-center justify-center transition-all duration-300 shadow-md
              hover:scale-110 hover:shadow-lg`}
                  >
                    <span className="text-lg md:text-xl lg:text-2xl">in</span>
                  </a>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 md:mt-12 pt-6 md:pt-8 border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"} text-center`}
            >
              <p
                className={`text-sm md:text-base lg:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                © 2025 petMatch - All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
