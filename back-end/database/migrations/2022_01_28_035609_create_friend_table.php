<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('friends', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('active_id');
            $table->string('passive_id');
            $table->string('status')->default(2);
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE friends ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('friends');
    }
}
