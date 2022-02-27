<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('group_id')->nullable();
            $table->string('sender_id');
            $table->longText('content')->nullable();
            $table->string('type');
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE posts ALTER COLUMN id SET DEFAULT uuid_generate_v4();');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
