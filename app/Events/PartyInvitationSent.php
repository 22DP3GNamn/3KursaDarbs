<?php

namespace App\Events;

use App\Models\User;
use App\Models\Party;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyInvitationSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $user;
    public $party;
    public $invitation;

    public function __construct(User $user, Party $party, $invitation = null)
    {
        $this->user = $user;
        $this->party = $party;
        $this->invitation = $invitation;
    }

    public function broadcastOn()
    {
        return new Channel('user.' . $this->user->id);
    }

    public function broadcastWith()
    {
        return [
            'party' => [
                'id' => $this->party->id,
                'name' => $this->party->name,
            ],
            'invitation_id' => $this->invitation ? $this->invitation->id : null,
            'message' => 'You have been invited to join a party!',
        ];
    }
}
