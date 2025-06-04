<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $profileImage = asset('Images/defaultpfp.png');

        return view('profile', [
            'user' => $user,
            'profileImage' => $profileImage,
        ]);
    }
}