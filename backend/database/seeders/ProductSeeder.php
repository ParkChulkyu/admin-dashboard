<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => '테스트 상품 A',
            'description' => '테스트 설명 A',
            'price' => 10000,
            'stock' => 50,
        ]);

        Product::create([
            'name' => '테스트 상품 B',
            'description' => '테스트 설명 B',
            'price' => 15000,
            'stock' => 30,
        ]);

        Product::create([
            'name' => '테스트 상품 C',
            'description' => '테스트 설명 C',
            'price' => 20000,
            'stock' => 10,
        ]);

        Product::create([
            'name' => '테스트 상품 D',
            'description' => '테스트 설명 D',
            'price' => 30000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => '테스트 상품 E',
            'description' => '테스트 설명 E',
            'price' => 35000,
            'stock' => 50,
        ]);

        Product::create([
            'name' => '테스트 상품 F',
            'description' => '테스트 설명 F',
            'price' => 40000,
            'stock' => 10,
        ]);

        Product::create([
            'name' => '테스트 상품 J',
            'description' => '테스트 설명 J',
            'price' => 20000,
            'stock' => 15,
        ]);
    }
}
