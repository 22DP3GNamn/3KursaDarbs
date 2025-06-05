<?php

namespace App\Events;

use App\Models\User;
use App\Models\Party;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PartyJoined implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $user;
    public $party;

    public function __construct(User $user, Party $party)
    {
        $this->user = $user;
        $this->party = $party;
    }

    public function broadcastOn()
    {
        return new Channel('party.' . $this->party->id);
    }

    public function broadcastWith()
    {
        return [
            'message' => "Player {$this->user->name ?? $this->user->username ?? $this->user->email} has joined the party!",
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'username' => $this->user->username,
                'email' => $this->user->email,
            ],
        ];
    }
}
