<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->string('table_id');
            $table->string('user_id');
            $table->text('content');
            $table->string('parent_id');
            $table->timestamps();
        });
        // DB::statement('ALTER TABLE comments ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
