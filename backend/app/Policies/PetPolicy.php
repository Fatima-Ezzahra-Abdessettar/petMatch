<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PetPolicy
{
    public function update(User $user, Pet $pet)
    {
        // vérifier le shelter_id car seul un admin du même shelter peut modifier le pet , 
        // mais admin peut changer / etre retraité d'un shelter du coup on vérifie juste le shelter_id
        return $user->shelter_id === $pet->shelter_id;
    }
}
