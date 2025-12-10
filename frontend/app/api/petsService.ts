// app/api/petsService.ts

const API_BASE = import.meta.env.DEV
  ? "http://localhost:8000"
  : import.meta.env.VITE_API_BASE || "http://localhost:8000";

const API_URL = `${API_BASE}/api`;

export interface Pet {
  id: number;
  name: string;
  species: string | null;
  type: string | null;
  age: number | null;
  gender: string;
  profile_picture: string | null;
  status: string;
  description: string;
}

class PetsService {
  async getPets(): Promise<Pet[]> {
    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }

      const pets: Pet[] = await response.json();
      return pets;
    } catch (error) {
      console.error("Get pets error:", error);
      throw error;
    }
  }
}

export const petsService = new PetsService();
