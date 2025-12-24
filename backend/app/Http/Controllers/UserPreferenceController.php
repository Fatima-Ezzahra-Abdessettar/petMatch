<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserPreferenceController extends Controller
{
    public function extractPreferences(Request $request)
    {
        $request->validate([
            'user_message' => 'required|string|max:2000',
        ]);

        $userMessage = $request->input('user_message');

        // Prompt très précis pour obtenir un JSON parfait
        $prompt = <<<PROMPT
Tu es un assistant expert qui transforme un message naturel d'un utilisateur en un JSON structuré pour une recherche d'animaux de compagnie.

Règles strictes :
- "species" : tableau de chaînes minuscules, seulement "dog" ou "cat" (ou les deux si mentionnés). Vide [] si non précisé.
- "type" : tableau de races/types en minuscules (ex: "pomeranian", "chihuahua", "persian", "british shorthair"). Vide [] si non précisé.
- "gender" : "male", "female" ou null si non précisé ou ambigu.
- "age" : objet avec "min" (integer ou null) et "max" (integer ou null). Utilise null si pas de borne.
- "status" : toujours "available".
- "keywords" : tableau de mots-clés descriptifs trouvés dans le message (ex: calme, joueur, appartement, enfants). Minuscules, vide [] si aucun.

Réponds UNIQUEMENT avec du JSON valide, rien d'autre (pas de texte, pas de ```json).

Exemple de message :
"Je cherche un petit chien calme pour appartement, pomeranian ou chihuahua, mâle ou femelle, entre 1 et 5 ans, ou un chat persan tranquille."

JSON attendu :
{
    "species": ["dog", "cat"],
    "type": ["pomeranian", "chihuahua", "persian"],
    "gender": null,
    "age": {"min": 1, "max": 5},
    "status": "available",
    "keywords": ["calme", "appartement", "tranquille"]
}

Maintenant, transforme ce message :
{$userMessage}
PROMPT;

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile', // Très bon et rapide. Tu peux aussi tester 'mixtral-8x7b-32768' ou 'gemma2-9b-it'
                'messages' => [
                    ['role' => 'system', 'content' => 'Tu réponds UNIQUEMENT en JSON valide.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 500,
            ]);

            if (!$response->successful()) {
                Log::error('Groq error: ' . $response->body());
                return response()->json(['error' => 'Erreur lors de la communication avec l\'IA'], 500);
            }

            $groqOutput = $response->json()['choices'][0]['message']['content'] ?? '';

            // Extraction du JSON (au cas où il y aurait du bruit)
            preg_match('/\{.*\}/s', $groqOutput, $matches);
            $jsonString = $matches[0] ?? $groqOutput;

            $preferences = json_decode($jsonString, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('JSON invalid from Groq: ' . $groqOutput);
                return response()->json(['error' => 'L\'IA n\'a pas retourné un JSON valide'], 500);
            }

            // Normalisation finale (Dev1 garantit un format parfait)
            $preferences = [
                'species' => is_array($preferences['species'] ?? []) ? array_map('strtolower', array_slice($preferences['species'], 0, 2)) : [],
                'type' => is_array($preferences['type'] ?? []) ? array_map('strtolower', $preferences['type']) : [],
                'gender' => in_array(strtolower($preferences['gender'] ?? ''), ['male', 'female']) ? strtolower($preferences['gender']) : null,
                'age' => [
                    'min' => isset($preferences['age']['min']) && is_int($preferences['age']['min']) ? $preferences['age']['min'] : null,
                    'max' => isset($preferences['age']['max']) && is_int($preferences['age']['max']) ? $preferences['age']['max'] : null,
                ],
                'status' => 'available',
                'keywords' => is_array($preferences['keywords'] ?? []) ? array_map('strtolower', $preferences['keywords']) : [],
            ];

            return response()->json([
                'preferences' => $preferences,
                'message' => 'Préférences extraites avec succès grâce à Groq ! 🧠➜🐾'
            ]);

        } catch (\Exception $e) {
            Log::error('Exception in extractPreferences: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur interne'], 500);
        }
    }
}