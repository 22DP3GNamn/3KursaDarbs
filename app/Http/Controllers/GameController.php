<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with('category')->get();
        return view('games.index', compact('games'));
    }
    public function show($id)
    {
        $game = Game::with(['category', 'comments.user'])->findOrFail($id);
        return view('game', compact('game'));
    }

    public function save(Request $request, $id = null)
    {
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
        $game = $id ? Game::findOrFail($id) : new Game();
        $game->fill($validated)->save();
        $message = $id ? 'Game updated successfully.' : 'Game created successfully.';
        return redirect()->route('games.index')->with('success', $message);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'category_id' => 'required|exists:categories,id',
        ]);

        $game = Game::create($validated);

        return response()->json(['message' => 'Game created successfully!', 'game' => $game]);
    }

    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return redirect()->route('games.index')->with('success', 'Game deleted successfully.');
    }
}