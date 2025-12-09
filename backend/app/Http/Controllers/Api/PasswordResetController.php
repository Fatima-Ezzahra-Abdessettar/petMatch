<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to user's email
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email address.',
                'status' => 'success'
            ], 200);
        }

        return response()->json([
            'message' => 'Unable to send reset link. Please try again.',
            'status' => 'error'
        ], 500);
    }

    /**
     * Reset the user's password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
                'status' => 'success'
            ], 200);
        }

        return response()->json([
            'message' => __($status),
            'status' => 'error'
        ], 400);
    }

    /**
     * Verify if reset token is valid
     */
    public function verifyToken(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::getRepository()->exists(
            $request->user(),
            $request->token
        );

        if ($status) {
            return response()->json([
                'message' => 'Token is valid.',
                'status' => 'success'
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid or expired token.',
            'status' => 'error'
        ], 400);
    }
}