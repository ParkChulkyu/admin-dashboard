<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->count() === 0 || $products->count() === 0) {
            $this->command->warn('유저나 상품이 부족해서 주문 시더를 건너뜁니다.');
            return;
        }

        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $orderDate = Carbon::now()->subDays(rand(0, 60)); // 최근 60일 내 랜덤 날짜
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => 0,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            $itemCount = rand(1, 3);
            $total = 0;

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $qty = rand(1, 5);
                $price = $product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price' => $price,
                ]);

                $total += $qty * $price;
            }

            $order->update(['total_price' => $total]);
        }
    }
}
