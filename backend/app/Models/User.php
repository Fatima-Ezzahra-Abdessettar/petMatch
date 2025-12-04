<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    public function addedPets()
    {
        return $this->hasMany(Pet::class, 'added_by');
    }

    public function adoptedPets()
    {
        return $this->hasMany(Pet::class, 'adopted_by');
    }

    public function adoptionApplications()
    {
        return $this->hasMany(AdoptionApplication::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    // si tu veux accéder aux pets favoris via belongsToMany :
    public function favoritePets()
    {
        return $this->belongsToMany(Pet::class, 'favorites')->withTimestamps();
    }
    public function isAdmin(): bool
    {
        return $this->role=='admin';
    }

    public function shelter()
    {
        return $this->belongsTo(Shelter::class);
    }
}
