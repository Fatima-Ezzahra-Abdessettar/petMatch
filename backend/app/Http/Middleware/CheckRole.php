<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    // role can be 'user' or 'admin'... in order to have a single middleware for both roles
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($request->user()->role !== $role) {
            return response()->json([
                'message' => "Accès non autorisé. Cette action nécessite le rôle '{$role}'."
            ], 403);
        }

        return $next($request);
    }
}