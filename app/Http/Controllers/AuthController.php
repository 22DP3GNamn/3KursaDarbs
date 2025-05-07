<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Attempt to log the user in
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // Regenerate session to prevent fixation attacks
            $request->session()->put('user', Auth::user()); // Store the authenticated user in the session
            return response()->json([
                'message' => 'Login successful!',
                'user' => Auth::user(), // Return the authenticated user
            ], 200);
        }

        // If login fails, return with an error
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
