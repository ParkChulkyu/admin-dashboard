<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'product_count' => Product::count(),
            'order_count' => Order::count(),
            'user_count' => User::count(),
            'recent_orders' => Order::with(['user', 'items.product']) // ✅ 다중 관계 include
                                        ->latest()
                                        ->take(5)
                                        ->get(),
        ]);
    }
}
