<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('type');
            $table->timestamps();
            $table->index(['report_id', 'order_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_images');
    }
};
