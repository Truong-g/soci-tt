<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('medias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('link');
            $table->string('type');
            $table->string('type_child')->nullable();
            $table->string('table_id')->nullable();
            $table->string('user_id')->nullable();
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE medias ALTER COLUMN id SET DEFAULT uuid_generate_v4();');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medias');
    }
}
