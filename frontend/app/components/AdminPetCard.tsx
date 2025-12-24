import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { Pet } from "../api/petsService";

interface AdminPetCardProps {
  pet: Pet;
  isDarkMode: boolean;
  isMenuOpen: boolean;
  onToggleMenu: (petId: number, e: React.MouseEvent) => void;
  onEdit: (petId: number) => void;
  onDelete: (petId: number, petName: string) => void;
  setMenuRef?: (petId: number, el: HTMLDivElement | null) => void;
}

const AdminPetCard: React.FC<AdminPetCardProps> = ({
  pet,
  isDarkMode,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  setMenuRef,
}) => {
  const backgroundImage = pet.profile_picture
    ? `url(${encodeURI(pet.profile_picture)})`
    : "none";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(pet.id)}
      onKeyDown={(e) => e.key === "Enter" && onEdit(pet.id)}
      className="relative p-4 flex flex-col justify-end rounded-xl xl:rounded-2xl w-full h-96 bg-cover bg-center transition-all duration-300 overflow-hidden cursor-pointer"
      style={{
        backgroundImage,
        backgroundColor: pet.profile_picture
          ? "transparent"
          : isDarkMode
          ? "#2A2724"
          : "#f3f4f6",
        boxShadow: isDarkMode
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)"
          : "0 20px 25px -5px rgba(163, 163, 163, 0.4), 0 8px 10px -6px rgba(163, 163, 163, 0.4)",
      }}
    >
      {/* Empty image */}
      {!pet.profile_picture && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color: isDarkMode ? "#73655B" : "#9ca3af" }}>
            No image
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="absolute top-3 left-3 z-20">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            pet.status === "available"
              ? "bg-green-500 text-white"
              : pet.status === "adopted"
              ? "bg-blue-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
        </span>
      </div>

      {/* Menu button */}
      <div className="absolute top-3 right-3 z-30">
        <button
          data-menu-button
          data-pet-id={pet.id}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(pet.id, e);
          }}
          className="p-2 rounded-lg backdrop-blur-sm"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(42, 39, 36, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
            color: isDarkMode ? "#F7F5EA" : "#333",
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>

        {isMenuOpen && (
          <div
            ref={(el) => setMenuRef?.(pet.id, el)}
            className="absolute right-0 mt-2 w-40 rounded-lg shadow-xl overflow-hidden z-50"
            style={{
              backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF",
              border: `1px solid ${isDarkMode ? "#73655B" : "#e5e7eb"}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(pet.id);
              }}
              className="w-full px-4 py-3 flex items-center gap-3"
              style={{ color: isDarkMode ? "#F7F5EA" : "#333" }}
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(pet.id, pet.name);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-600"
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-12 backdrop-blur-sm rounded-b-xl xl:rounded-b-2xl"
        style={{
          background: isDarkMode
            ? "linear-gradient(to top, rgba(0,0,0,0.9), transparent)"
            : "linear-gradient(to top, rgba(255,255,255,0.95), transparent)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: isDarkMode ? "#F5F3ED" : "#36332E" }}
        >
          {pet.name}
        </h2>

        <p
          className="text-sm line-clamp-2"
          style={{ color: isDarkMode ? "#E5E1D9" : "#666" }}
        >
          {pet.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default AdminPetCard;
