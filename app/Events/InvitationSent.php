<?php

namespace App\Events;

use App\Models\Invitation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class InvitationSent implements ShouldBroadcast
{
    use SerializesModels;

    public $invitation;

    /**
     * Create a new event instance.
     */
    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation->load('party');
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->invitation->user_id);
    }
}
