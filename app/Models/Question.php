<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'level_id'
    ];

    public function levels()
    {
        return $this->belongsToMany(Level::class, 'level_questions');
    }
}
