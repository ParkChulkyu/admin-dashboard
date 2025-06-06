<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 외래 키 제약 비활성화
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 카테고리별 더미 상품 생성
        $categories = Category::all();

        foreach ($categories as $category) {
            for ($i = 1; $i <= 3; $i++) {
                Product::create([
                    'name' => "{$category->name} 상품 {$i}",
                    'price' => rand(1000, 50000),
                    'stock' => rand(1, 100),
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
