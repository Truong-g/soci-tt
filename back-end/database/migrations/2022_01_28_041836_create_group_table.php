<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('group_name')->nullable();
            $table->string('intro')->nullable();
            $table->string('group_admin')->nullable();
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE groups ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
