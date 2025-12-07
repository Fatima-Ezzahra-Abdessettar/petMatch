<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;

class PetPolicy
{
    /**
     * Determine if the user can view any pets.
     */
    public function viewAny(?User $user): bool
    {
        // Anyone can browse pets (even guests)
        return true;
    }

    /**
     * Determine if the user can view a specific pet.
     */
    public function view(?User $user, Pet $pet): bool
    {
        // Anyone can view individual pet details
        return true;
    }

    /**
     * Determine if the user can create pets.
     */
    public function create(User $user): bool
    {
        // Only admins with a shelter can create pets
        return $user->isAdmin() && $user->shelter_id !== null;
    }

    /**
     * Determine if the user can update the pet.
     */
    public function update(User $user, Pet $pet): bool
    {
        // Only admins from the same shelter can update
        return $user->isAdmin() && $user->shelter_id === $pet->shelter_id;
    }

    /**
     * Determine if the user can delete the pet.
     */
    public function delete(User $user, Pet $pet): bool
    {
        // Only admins from the same shelter can delete
        return $user->isAdmin() && $user->shelter_id === $pet->shelter_id;
    }

    /**
     * Determine if the user can restore the pet.
     */
    public function restore(User $user, Pet $pet): bool
    {
        return $user->isAdmin() && $user->shelter_id === $pet->shelter_id;
    }

    /**
     * Determine if the user can permanently delete the pet.
     */
    public function forceDelete(User $user, Pet $pet): bool
    {
        return $user->isAdmin() && $user->shelter_id === $pet->shelter_id;
    }
}
