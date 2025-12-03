<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('adoption_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // applicant
            $table->foreignId('pet_id')->constrained('pets')->cascadeOnDelete();
            $table->json('form_data')->nullable(); // stockage flexible du formulaire (questions + réponses)
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete(); // staff who reviewed
            $table->enum('status', ['pending', 'approved', 'denied'])->default('pending');
            $table->timestamps();

            $table->unique(['user_id', 'pet_id']); // un user ne peut pas soumettre deux fois la même demande
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adoption_applications');
    }
};
