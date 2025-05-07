<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\View;

class UserController extends Controller
{

    public function users()
    {
        return response()->json(User::all());  
    }
    
    public function __construct()
    {
        View::share('authenticatedUser', auth()->user());
    }

    public function getUsers()
    {
         return response()->json(User::all());
    }

    public function removeUser($id)
    {
        $user = User::findOrFail($id); // Find the user by ID or throw a 404
        $user->delete(); // Delete the user
        return response()->json(['message' => 'User deleted successfully']);
    }

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

    public function bulkDeleteUsers(Request $request)
    {
        $userIds = $request->input('userIds');

        User::whereIn('id', $userIds)->delete();

        return response()->json(['message' => 'Users deleted successfully']);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id); // Ensure the user exists
        $request->validate([
            'role' => 'required|string|in:user,admin', // Validate the role
        ]);

        $user->role = $request->role; // Update the role
        $user->save(); // Save the changes

        return response()->json(['message' => 'Role updated successfully']);
    }
    
}