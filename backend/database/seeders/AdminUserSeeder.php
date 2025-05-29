<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;  // ✅ 이거 추가!

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // 이메일 중복 여부 확인
        $exists = DB::table('users')->where('email', 'admin@example.com')->exists();

        if (!$exists) {
            User::create([
                'name' => '관리자테스트',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);
        }
    }
}
