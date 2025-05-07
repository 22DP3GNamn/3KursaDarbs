<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LevelQuestion extends Model
{
    protected $table = 'level_questions';
    public $timestamps = false;

    protected $fillable = ['question_id', 'level_id'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
