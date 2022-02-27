<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('conv_name')->nullable();
            $table->string('topic')->default("tp1");
            $table->tinyInteger('is_group')->default(0);
            $table->string('group_admin')->nullable();
            $table->longText('latest_msg')->nullable();
            $table->string('latest_msg_person')->nullable();
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE converstions ALTER COLUMN id SET DEFAULT uuid_generate_v4();');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('conversations');
    }
}
