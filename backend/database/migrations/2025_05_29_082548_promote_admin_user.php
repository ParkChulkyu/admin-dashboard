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
        // 이메일 기준으로 관리자 승격 (수정 가능)
        DB::table('users')
            ->where('email', 'admin@example.com') // ✅ 실제 이메일로 바꿔줘
            ->update(['is_admin' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 되돌릴 수 있도록 관리자 해제
        DB::table('users')
            ->where('email', 'admin@example.com') // 동일하게 유지
            ->update(['is_admin' => false]);
    }
};
