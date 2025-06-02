<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user') // 주문자 정보 포함
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }
}
