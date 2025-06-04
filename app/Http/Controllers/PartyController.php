<?php

namespace App\Http\Controllers;

use App\Models\Party;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartyController extends Controller
{
    /**
     * Create a new party.
     */
    public function create(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $party = Party::create(['name' => $request->name, 'owner_id' => Auth::id()]);
        $party->users()->attach(Auth::id());
        Auth::user()->update(['current_party_id' => $party->id]);
        return response()->json(['message' => 'Party created successfully!', 'party' => $party]);
    }

    /**
     * Invite a user to the party.
     */
    public function inviteUser(Request $request, Party $party)
    {
        $request->validate(['username' => 'required|exists:users,username']);
        $user = \App\Models\User::where('username', $request->username)->first();
        Invitation::updateOrCreate(['party_id' => $party->id, 'user_id' => $user->id], ['status' => 'pending']);
        return response()->json(['message' => 'User invited successfully!']);
    }

    /**
     * Kick a user from the party.
     */
    public function kickUser(Party $party, $userId)
    {
        $this->authorizePartyOwner($party);

        $party->users()->detach($userId);

        return response()->json(['message' => 'User kicked from the party!']);
    }

    /**
     * Disband the party.
     */
    public function disbandParty(Party $party)
    {
        $this->authorizePartyOwner($party);

        $party->users()->update(['current_party_id' => null]);
        $party->delete();

        return response()->json(['message' => 'Party disbanded successfully!']);
    }

    /**
     * Get the current party of the authenticated user.
     */
    public function getCurrentParty()
    {
        $party = Party::with('users')->find(Auth::user()->current_party_id);

        if (!$party) {
            return response()->json(['party' => null, 'message' => 'No active party found.'], 404);
        }

        return response()->json(['party' => $party]);
    }

    /**
     * Get pending invitations for the authenticated user.
     */
    public function getInvitations()
    {
        $invitations = Invitation::with('party')
            ->where('user_id', Auth::id())
            ->where('status', 'pending')
            ->get();

        return response()->json($invitations);
    }

    /**
     * Respond to an invitation.
     */
    public function respondToInvitation(Request $request, Invitation $invitation)
    {
        $request->validate(['status' => 'required|in:accepted,rejected']);
        $invitation->update(['status' => $request->status]);
        if ($request->status === 'accepted') {
            $invitation->party->users()->attach($invitation->user_id);
            Auth::user()->update(['current_party_id' => $invitation->party_id]);
        }
        return response()->json(['message' => 'Invitation response recorded!']);
    }

    /**
     * Authorize that the authenticated user is the party owner.
     */
    private function authorizePartyOwner(Party $party)
    {
        if ($party->owner_id !== Auth::id()) {
            abort(403, 'Only the party owner can perform this action!');
        }
    }
}