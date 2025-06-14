<?php

use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestMail;
use App\Models\User;
use App\Models\Game;
use App\Models\Category;

// API Routes
Route::get('/api/user-session', function () {return response()->json(['user' => Auth::user()]);});
Route::delete('/api/users/bulk-delete', [UserController::class, 'bulkDeleteUsers']);
Route::put('/api/users/bulk-update', [UserController::class, 'bulkUpdateUsers']);
Route::put('/api/users/{id}/update-role', [UserController::class, 'updateRole']);
Route::patch('/api/users/{id}', [UserController::class, 'updateUserDetails']);
Route::post('/api/save-users', [UserController::class, 'saveUsers']);
Route::get('/api/games', function () {
    return response()->json(Game::with('category')->get());
});
Route::get('/api/games/{id}', function ($id) {
    $game = Game::with('category')->find($id);
    if (!$game) {
        return response()->json(['error' => 'Game not found'], 404);
    }
    return response()->json($game);
});
Route::get('/api/categories', function () {
    return response()->json(Category::all());
});
Route::post('/api/games', [GameController::class, 'store']); // Ensure the route for creating games is properly defined

// Admin Routes
Route::get('/admin', function () {return view('admin');})->middleware('admin');
Route::delete('/users/{user}', [UserController::class, 'removeUser'])->middleware('admin');
Route::get('/users', [UserController::class, 'getUsers'])->middleware('admin');
Route::post('/save-users', [UserController::class, 'saveUsers']);

// Authentication Routes
Route::get('/login', function () {return view('login');})->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login')->with('success', 'You have been logged out.');
})->name('logout');

// Registration Routes
Route::get('/register', function () {return view('registration');});
Route::post('/register', [RegistrationController::class, 'registerAndRedirect']);

// User Routes
Route::get('/profile', [ProfileController::class, 'show'])->name('profile')->middleware('auth');
Route::get('/users', function () {return User::all();})->middleware('auth');

// Home Routes
Route::get('/', function () {
    $games = Game::all();
    return view('home', compact('games'));
})->name('home');

// Email Testing Route
Route::get('/send-test-email', function () {Mail::to('recipient@example.com')->send(new TestMail());return 'Test email sent!';})->name('send-test-email');

// Party Route
Route::middleware('auth')->group(function () {
    // Serve the Party Page
    Route::get('/party', fn() => view('party')); // Add this route for GET requests

    // Fetch the current party
    Route::get('/party/current', [PartyController::class, 'getCurrentParty']);

    // Other Party Routes
    Route::post('/party', [PartyController::class, 'create']);
    Route::post('/party/{party}/invite', [PartyController::class, 'inviteUser']);
    Route::post('/invitation/{invitation}/respond', [PartyController::class, 'respondToInvitation']);
    Route::delete('/party/{party}/kick/{userId}', [PartyController::class, 'kickUser']);
    Route::delete('/party/{party}', [PartyController::class, 'disbandParty']);
    Route::get('/invitations', [PartyController::class, 'getInvitations']);
    Route::post('/party/{party}/leave', [PartyController::class, 'leaveParty'])->middleware('auth');
});

// Game Routes
Route::get('/game/{id}', [GameController::class, 'show'])->name('game.show'); // Specific route first
Route::get('/game', function () { return view('game'); })->name('game'); // General route after
Route::get('/games', [GameController::class, 'index'])->name('games.index');
Route::post('/games', [GameController::class, 'save'])->name('games.store');
Route::put('/games/{id}', [GameController::class, 'save'])->name('games.update');
Route::delete('/games/{id}', [GameController::class, 'destroy'])->name('games.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/games/create', fn() => view('creategame'));
    
    Route::post('/api/games', [GameController::class, 'store']);
    
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});