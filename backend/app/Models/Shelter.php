<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shelter extends Model
{
    protected $fillable = ['name','address','city','country','phone','email'];

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }
}

