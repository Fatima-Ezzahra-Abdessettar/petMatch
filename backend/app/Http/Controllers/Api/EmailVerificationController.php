<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Verify email without requiring authentication (public route)
     */
    public function verifyPublic(Request $request, $id, $hash)
    {
        // Find the user
        $user = User::findOrFail($id);

        // Verify the hash matches
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect(config('app.frontend_url') . '/login?verified=invalid');
        }

        // Check if URL signature is valid
        if (!$request->hasValidSignature()) {
            return redirect(config('app.frontend_url') . '/login?verified=expired');
        }

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/login?verified=already');
        }

        // Mark as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect(config('app.frontend_url') . '/login?verified=success');
    }

    /**
     * Resend the email verification notification.
     */
    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent successfully'
        ]);
    }
}