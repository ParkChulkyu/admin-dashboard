<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Category;

class DashboardController extends Controller
{

    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $todaySales = Order::whereDate('created_at', $today)->sum('total_price');
        $monthSales = Order::whereBetween('created_at', [$startOfMonth, now()])->sum('total_price');

        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, SUM(order_items.quantity * order_items.price) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'product_count' => Product::count(),
            'order_count' => Order::count(),
            'user_count' => User::count(),
            'recent_orders' => Order::with(['user', 'items.product'])->latest()->take(5)->get(),
            'monthly_sales' => Order::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as total")
                ->groupBy('month')->orderBy('month', 'desc')->take(6)->get()->reverse()->values(),
            'today_sales' => $todaySales,
            'month_sales' => $monthSales,
            'category_sales' => $categorySales,
        ]);
    }
}
