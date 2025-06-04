<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\View;

class UserController extends Controller
{
    public function __construct()
    {
        View::share('authenticatedUser', \Illuminate\Support\Facades\Auth::user());
    }

    // Fetch all users
    public function getUsers()
    {
        return response()->json(User::all());
    }

    // Update user details
    public function updateUserDetails(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|string|in:user,admin',
        ]);

        $user->update($request->only(['username', 'email', 'role']));

        return response()->json(['message' => 'User updated successfully']);
    }

    // Update user role
    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'role' => 'required|string|in:user,admin',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Role updated successfully']);
    }

    // Bulk update users
    public function bulkUpdateUsers(Request $request)
    {
        $updatedUsers = $request->input('users');

        foreach ($updatedUsers as $updatedUser) {
            $user = User::findOrFail($updatedUser['id']);
            $user->role = $updatedUser['role'];
            $user->save();
        }

        return response()->json(['message' => 'Users updated successfully']);
    }

    // Delete a single user
    public function removeUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // Bulk delete users
    public function bulkDeleteUsers(Request $request)
    {
        $userIds = $request->input('userIds');
        User::whereIn('id', $userIds)->delete();

        return response()->json(['message' => 'Users deleted successfully']);
    }

    public function saveUsers(Request $request)
    {
        $users = $request->input('users');

        foreach ($users as $userData) {
            $user = User::find($userData['id']);
            if ($user) {
                if (isset($userData['markedForDeletion']) && $userData['markedForDeletion']) {
                    $user->delete();
                } else {
                    $user->update([
                        'username' => $userData['username'],
                        'email' => $userData['email'],
                        'role' => $userData['role'],
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Users updated successfully.'], 200);
    }
}