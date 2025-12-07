<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;
use App\Models\User;


class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }
// The policy mappings for the application.
  protected $policies = [
    \App\Models\Pet::class => \App\Policies\PetPolicy::class,
  ];

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    // Seul l'admin peut gérer les pets
    Gate::define('manage-pets', function (User $user) {
      return $user->role === 'admin';
    });

    // Seul l'admin peut accéder au dashboard
    Gate::define('access-admin-dashboard', function (User $user) {
      return $user->role === 'admin';
    });
  }
}
