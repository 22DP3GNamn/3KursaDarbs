<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('level', function (Blueprint $table) {
            $table->id();
            $table->integer('level_number')->unique();
            $table->integer('max_score');
            $table->integer('score')->default(0);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level');
    }
};
