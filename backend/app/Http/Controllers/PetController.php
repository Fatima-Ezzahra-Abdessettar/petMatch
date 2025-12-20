<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PetController extends Controller
{
    /**
     * Display a listing of pets (public)
     */
    public function index()
    {
        $pets = Pet::with('shelter')->where('status', 'available')->get();
        return response()->json($pets);
    }

    /**
     * Display the specified pet (authenticated)
     */
    public function show(Pet $pet)
    {
        $pet->load('shelter');
        return response()->json($pet);
    }

    /**
     * Get pets for the authenticated admin's shelter
     */
    public function myPets()
    {
        $admin = Auth::user();

        $pets = Pet::where('shelter_id', $admin->shelter_id)
            ->with('shelter')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pets);
    }

    /**
     * Store a newly created pet
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        Log::info('Store method called', [
            'has_file' => $request->hasFile('profile_picture'),
            'all_files' => $request->allFiles(),
            'content_type' => $request->header('Content-Type'),
        ]);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:100',
            'age' => 'nullable|integer|min:0',
            'gender' => 'required|in:male,female',
            'profile_picture' => 'nullable|image|max:5120', // 5MB max
            'status' => 'required|in:available,adopted,pending',
            'description' => 'required|string',
        ]);

        // Handle file upload
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $this->handleFileUpload($request->file('profile_picture'));
        }

        $pet = Pet::create([
            'name' => $data['name'],
            'species' => $data['species'] ?? null,
            'type' => $data['type'] ?? null,
            'age' => $data['age'] ?? null,
            'gender' => $data['gender'],
            'profile_picture' => $profilePicturePath,
            'status' => $data['status'],
            'description' => $data['description'],
            'shelter_id' => $admin->shelter_id,
            'added_by' => $admin->id,
        ]);

        Log::info('Pet created', [
            'pet_id' => $pet->id,
            'profile_picture' => $pet->profile_picture,
        ]);

        return response()->json($pet, 201);
    }

    /**
     * Update the specified pet
     */
    public function update(Request $request, Pet $pet)
    {
        $admin = Auth::user();

        // Ensure the pet belongs to the admin's shelter
        if ($pet->shelter_id !== $admin->shelter_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'species' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:100',
            'age' => 'nullable|integer|min:0',
            'gender' => 'sometimes|required|in:male,female',
            'profile_picture' => 'nullable|image|max:5120',
            'status' => 'sometimes|required|in:available,adopted,pending',
            'description' => 'sometimes|required|string',
        ]);

        // Handle image upload
        if ($request->hasFile('profile_picture')) {
            // Delete old image if exists
            if ($pet->profile_picture) {
                $this->deleteImage($pet->profile_picture);
            }
            // Upload new image
            $data['profile_picture'] = $this->handleFileUpload($request->file('profile_picture'));
        }

        $pet->update($data);

        return response()->json($pet);
    }

    /**
     * Remove the specified pet
     */
    public function destroy(Pet $pet)
    {
        $admin = Auth::user();

        // Ensure the pet belongs to the admin's shelter
        if ($pet->shelter_id !== $admin->shelter_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete image if exists
        if ($pet->profile_picture) {
            $this->deleteImage($pet->profile_picture);
        }

        $pet->delete();

        return response()->json(['message' => 'Pet deleted successfully']);
    }

    /**
     * Get pet statistics for the admin's shelter
     */
    public function stats()
    {
        $admin = Auth::user();

        $stats = [
            'total' => Pet::where('shelter_id', $admin->shelter_id)->count(),
            'available' => Pet::where('shelter_id', $admin->shelter_id)->where('status', 'available')->count(),
            'adopted' => Pet::where('shelter_id', $admin->shelter_id)->where('status', 'adopted')->count(),
            'pending' => Pet::where('shelter_id', $admin->shelter_id)->where('status', 'pending')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Handle file upload
     */
    private function handleFileUpload($file)
{
    try {
        Log::info('Starting file upload', [
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        // Ensure the pets directory exists
        if (!Storage::disk('public')->exists('pets')) {
            Storage::disk('public')->makeDirectory('pets');
            Log::info('Created pets directory');
        }

        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::random(40) . '.' . $extension;

        Log::info('Generated filename', ['filename' => $fileName]);

        // Store in public disk under 'pets' directory
        $path = $file->storeAs('pets', $fileName, 'public');

        Log::info('File stored', [
            'path' => $path,
            'full_path' => storage_path('app/public/' . $path),
            'exists' => Storage::disk('public')->exists($path),
        ]);

        // Return the full URL with backend domain
        $backendUrl = env('APP_URL', 'http://localhost:8000');
        return $backendUrl . '/storage/' . $path;
    } catch (\Exception $e) {
        Log::error('File upload error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);
        return null;
    }
}
    /**
     * Delete image from storage
     */
    private function deleteImage($imagePath)
    {
        if (empty($imagePath)) {
            return;
        }

        try {
            // Extract the file path from URL
            if (strpos($imagePath, '/storage/') === 0) {
                $filePath = str_replace('/storage/', '', $imagePath);
                
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                    Log::info('Deleted image', ['path' => $filePath]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error deleting image: ' . $e->getMessage());
        }
    }

    /**
     * Show a single pet for admin (for editing)
     */
    public function showForAdmin(Pet $pet)
    {
        $admin = Auth::user();

        // Ensure the pet belongs to the admin's shelter
        if ($pet->shelter_id !== $admin->shelter_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pet->load('shelter');
        return response()->json($pet);
    }

    /**
     * Test storage functionality
     */
    public function testStorage()
    {
        try {
            // Test writing a file
            Storage::disk('public')->put('test.txt', 'Hello World');
            
            $exists = Storage::disk('public')->exists('test.txt');
            $path = storage_path('app/public/test.txt');
            
            // Create pets directory if it doesn't exist
            if (!Storage::disk('public')->exists('pets')) {
                Storage::disk('public')->makeDirectory('pets');
            }
            
            return response()->json([
                'success' => true,
                'storage_path' => storage_path('app/public'),
                'file_exists' => $exists,
                'full_path' => $path,
                'is_writable' => is_writable(storage_path('app/public')),
                'pets_dir_exists' => Storage::disk('public')->exists('pets'),
                'contents' => $exists ? Storage::disk('public')->get('test.txt') : null,
                'files_in_public' => Storage::disk('public')->allFiles(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}