<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class Admin extends Model
{
    public static function getAllUsers()
    {
        return DB::table('users')->get();
    }
    public static function removeUserData($userID)
    {
        DB::table('users')->delete();
    }
}