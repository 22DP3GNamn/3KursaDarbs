<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $profileImage = asset('Images/defaultpfp.png');

        return view('profile', [
            'user' => $user,
            'profileImage' => $profileImage,
        ]);
    }
}