<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        schema::create('user_lvl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('level_id')->constrained('level')->onDelete('cascade');
            $table->boolean('status')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_lvl');
    }
};
