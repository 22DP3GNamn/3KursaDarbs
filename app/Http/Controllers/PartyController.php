<?php

namespace App\Http\Controllers;

use App\Models\Party;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class PartyController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $party = Party::create([
            'name' => $request->name,
            'owner_id' => Auth::id(),
        ]);

        $party->users()->attach(Auth::id());

        // Update the user's current party
        $user = Auth::user();

        if ($user instanceof \App\Models\User) {
            $user->current_party_id = $party->id;
            if ($user instanceof \App\Models\User) {
                if ($user instanceof \App\Models\User) {
                    $user->save();
                } else {
                    return response()->json(['message' => 'Authenticated user is invalid.'], 500);
                }
            } else {
                return response()->json(['message' => 'Authenticated user is invalid.'], 500);
            }
        } else {
            return response()->json(['message' => 'Authenticated user is invalid.'], 500);
        }

        return response()->json(['message' => 'Party created successfully!', 'party' => $party]);
    }

    public function inviteUser(Request $request, Party $party)
    {
        $request->validate([
            'username' => 'required|exists:users,username',
        ]);

        $user = \App\Models\User::where('username', $request->username)->first();

        if ($party->users()->count() >= 5) {
            return response()->json(['message' => 'Party is full!'], 400);
        }

        Invitation::create([
            'party_id' => $party->id,
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'User invited successfully!']);
    }

    public function kickUser(Party $party, $userId)
    {
        if ($party->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Only the party owner can kick users!'], 403);
        }

        $party->users()->detach($userId);

        return response()->json(['message' => 'User kicked from the party!']);
    }

    public function disbandParty(Party $party)
    {
        if ($party->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Only the party owner can disband the party!'], 403);
        }

        // Clear the current_party_id for all users in the party
        $party->users()->update(['current_party_id' => null]);

        $party->delete();

        return response()->json(['message' => 'Party disbanded successfully!']);
    }

    public function getCurrentParty()
    {
        $user = Auth::user();

        if ($user->current_party_id) {
            $party = Party::with('users')->find($user->current_party_id);
            return response()->json(['party' => $party]);
        }

        return response()->json(['party' => null]);
    }

    public function getInvitations()
    {
        $invitations = Invitation::with('party')
            ->where('user_id', Auth::id())
            ->where('status', 'pending')
            ->get();

        return response()->json($invitations);
    }

    public function respondToInvitation(Request $request, Invitation $invitation)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $invitation->update(['status' => $request->status]);

        if ($request->status === 'accepted') {
            $invitation->party->users()->attach($invitation->user_id);

            // Update the user's current party
            $user = Auth::user();
            $user->current_party_id = $invitation->party_id;
            if ($user instanceof \App\Models\User) {
                $user->save();
            } else {
                return response()->json(['message' => 'Authenticated user is invalid.'], 500);
            }
        }

        return response()->json(['message' => 'Invitation response recorded!']);
    }

    public function users()
{
    return $this->belongsToMany(User::class, 'party_user');
}
}