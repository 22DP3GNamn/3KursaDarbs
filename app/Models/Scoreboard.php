<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scoreboard extends Model
{
    protected $fillable = ['user_id', 'overall_score'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
