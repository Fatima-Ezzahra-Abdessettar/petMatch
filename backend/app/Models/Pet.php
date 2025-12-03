<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'name','species','type','age','description',
        'shelter_id','added_by','adopted_by','gender','status'
    ];

    public function shelter()
    {
        return $this->belongsTo(Shelter::class);
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function adoptedBy()
    {
        return $this->belongsTo(User::class, 'adopted_by');
    }

    public function adoptionApplications()
    {
        return $this->hasMany(AdoptionApplication::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}

