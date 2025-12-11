export interface Pet {
  id: number;
  name: string;
  species: string | null;
  type: 'dog' | 'cat' | 'bird' | 'other' | string | null;
  age: number | null;
  gender: 'male' | 'female' | string;
  profile_picture: string | null;
  status: string;
  description: string;
  breed?: string;
  ageGroup?: 'puppy' | 'young' | 'adult' | 'senior';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  // Ajoutez d'autres champs selon vos besoins
}
