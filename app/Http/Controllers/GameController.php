<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of all games.
     */
    public function index()
    {
        // Fetch all games with their categories
        $games = Game::with('category')->get();
        return view('games.index', compact('games'));
    }

    /**
     * Display the specified game.
     */
    public function show($id)
    {
        // Retrieve the game by ID with related category and comments
        $game = Game::with(['category', 'comments.user'])->findOrFail($id);

        // Pass the $game variable to the view
        return view('game', compact('game'));
    }

    /**
     * Store or update a game in storage.
     */
    public function save(Request $request, $id = null)
    {
        // Validate the request data with custom error messages
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'category_id' => 'required|exists:categories,id',
        ], [
            'name.required' => 'The game name is required.',
            'status.in' => 'The status must be either active or inactive.',
            'category_id.exists' => 'The selected category does not exist.',
        ]);

        // Find the game by ID or create a new instance
        $game = $id ? Game::findOrFail($id) : new Game();
        $game->fill($validated)->save();

        // Set the success message
        $message = $id ? 'Game updated successfully.' : 'Game created successfully.';
        return redirect()->route('games.index')->with('success', $message);
    }

    /**
     * Remove the specified game from storage.
     */
    public function destroy($id)
    {
        // Find the game by ID and delete it
        $game = Game::findOrFail($id);

        // Optional: Check for soft delete
        $game->delete();

        return redirect()->route('games.index')->with('success', 'Game deleted successfully.');
    }
}