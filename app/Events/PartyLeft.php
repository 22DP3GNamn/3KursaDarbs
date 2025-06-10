<?php

namespace App\Events;

use App\Models\User;
use App\Models\Party;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use \Illuminate\Support\Facades\Auth;

class PartyLeft implements ShouldBroadcast
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
            'message' => Auth::id() !== $this->user->id 
                ? "Player " . ($this->user->name ?? $this->user->username ?? $this->user->email) . " has left the party!"
                : null,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'username' => $this->user->username,
                'email' => $this->user->email,
            ],
        ];
    }
}
