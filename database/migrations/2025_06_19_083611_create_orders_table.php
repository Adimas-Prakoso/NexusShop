<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->string('email');
            $table->integer('service_id');
            $table->string('service_name');
            $table->string('target');
            $table->integer('quantity');
            $table->text('comments')->nullable();
            $table->text('usernames')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('status')->default('pending'); // pending, processing, completed, cancelled, partial
            $table->string('medanpedia_order_id')->nullable();
            $table->text('medanpedia_response')->nullable();
            $table->integer('start_count')->nullable();
            $table->integer('remains')->nullable();
            $table->string('currency', 3)->default('IDR');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
