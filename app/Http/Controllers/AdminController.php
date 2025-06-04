<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{

    public function updateUserRole(Request $request, $id)
    {
        Log::info('Request received for updating user role', [
            'user_id' => $id,
            'role' => $request->input('role'),
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();

        Log::info('User role updated successfully', [
            'user_id' => $id,
            'new_role' => $user->role,
        ]);

        return response()->json(['message' => 'User role updated successfully']);
    }
}