<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLvl extends Model
{
    protected $table = 'user_lvl';
    public $timestamps = false;

    protected $fillable = ['user_id', 'level_id', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
    
}