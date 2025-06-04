<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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