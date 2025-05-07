<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $table = 'level';
    public $timestamps = false;

    protected $fillable = ['level_number', 'max_score', 'score'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_lvl');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'level_questions');
    }

    public function userLvls()
    {
        return $this->hasMany(UserLvl::class);
    }
}