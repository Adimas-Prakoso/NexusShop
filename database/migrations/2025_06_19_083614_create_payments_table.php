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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('payment_id')->unique();
            $table->string('midtrans_order_id')->unique();
            $table->string('payment_method'); // qris, bank_transfer, credit_card, etc
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('IDR');
            $table->string('status')->default('pending'); // pending, paid, failed, expired, cancelled
            $table->text('midtrans_response')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('qr_code_url')->nullable();
            $table->string('va_number')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
