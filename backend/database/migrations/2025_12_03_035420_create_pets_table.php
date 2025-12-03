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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('species')->nullable(); // ex: dog, cat
            $table->string('type')->nullable();    // ex: breed or subtype
            $table->integer('age')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('shelter_id')->nullable()->constrained('shelters')->nullOnDelete();
            $table->foreignId('added_by')->nullable()->constrained('users')->nullOnDelete();    // user who added the pet
            $table->foreignId('adopted_by')->nullable()->constrained('users')->nullOnDelete();  // adopter user id
            $table->enum('gender', ['male', 'female', 'unknown'])->default('unknown');
            $table->enum('status', ['available', 'pending', 'adopted'])->default('available');
            $table->timestamps();

            $table->index(['shelter_id']);
            $table->index(['added_by']);
            $table->index(['adopted_by']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
