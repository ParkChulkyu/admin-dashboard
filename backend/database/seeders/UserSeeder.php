<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 기존 데이터 제거
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 관리자 계정
        User::create([
            'name' => '관리자',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // 비밀번호는 "password"
            'is_admin' => true,
        ]);

        // 일반 유저들
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => "회원{$i}",
                'email' => "user{$i}@example.com",
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]);
        }
    }
}
