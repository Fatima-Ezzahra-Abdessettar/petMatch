<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est authentifié ET est admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Accès non autorisé. Seuls les admins peuvent effectuer cette action.'
            ], 403);
        }

        return $next($request);
    }
}