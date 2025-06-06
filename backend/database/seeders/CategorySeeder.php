<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['의류', '전자제품', '식품', '도서', '생활용품'];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}