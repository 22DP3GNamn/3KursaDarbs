<?php

namespace App\Http\Controllers;

use App\Models\Party;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\PartyInvitationSent;
use Illuminate\Support\Facades\Log;

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

        if ($user instanceof User) {
            $user->current_party_id = $party->id;
            if ($user instanceof User) {
                if ($user instanceof User) {
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

        // Get the invited user (User B)
        $user = User::where('username', $request->username)->first();

        // Count current members + pending invitations
        $currentMembers = $party->users()->count();
        $pendingInvites = \App\Models\Invitation::where('party_id', $party->id)
            ->where('status', 'pending')
            ->count();

        if ($currentMembers + $pendingInvites >= 5) {
            return response()->json(['message' => 'Party is full!'], 400);
        }

        $invitation = Invitation::create([
            'party_id' => $party->id,
            'user_id' => $user->id,
        ]);

        // Debug log before broadcasting the event
        Log::info('About to broadcast PartyInvitationSent', ['user_id' => $user->id, 'party_id' => $party->id]);

        try {
            event(new PartyInvitationSent($user, $party, $invitation));
            Log::info('Broadcasted PartyInvitationSent', ['user_id' => $user->id, 'party_id' => $party->id]);
        } catch (\Throwable $e) {
            Log::error('Failed to broadcast PartyInvitationSent', [
                'user_id' => $user->id,
                'party_id' => $party->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json(['message' => 'User invited successfully!']);
    }

    public function invite(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email'
        ]);

        // ...your invitation logic here...

        return response()->json(['message' => 'Invitation sent successfully!']);
    }

    public function kickUser(Party $party, $userId)
    {
        if ($party->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Only the party owner can kick users!'], 403);
        }

        $party->users()->detach($userId);

        // Clear the kicked user's current_party_id
        $kickedUser = User::find($userId);
        if ($kickedUser) {
            $kickedUser->current_party_id = null;
            $kickedUser->save();
            event(new \App\Events\PartyKicked($kickedUser));
        }

        // If no users left in the party, delete it and its invitations
        if ($party->users()->count() === 0) {
            \App\Models\Invitation::where('party_id', $party->id)->delete();
            $party->delete();
        }

        return response()->json(['message' => 'User kicked from the party!']);
    }

    public function disbandParty(Party $party)
    {
        if ($party->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Only the party owner can disband the party!'], 403);
        }

        // Clear the current_party_id for all users in the party
        $party->users()->update(['current_party_id' => null]);

        // Delete all invitations for this party
        \App\Models\Invitation::where('party_id', $party->id)->delete();

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
            if ($user instanceof User) {
                $user->save();
            } else {
                return response()->json(['message' => 'Authenticated user is invalid.'], 500);
            }

            // Broadcast PartyJoined event to all party members
            event(new \App\Events\PartyJoined($user, $invitation->party));
        }

        return response()->json(['message' => 'Invitation response recorded!']);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'party_user');
    }
}