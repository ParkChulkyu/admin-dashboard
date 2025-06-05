<?php
// app/Http/Controllers/Api/Admin/OrderController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    // 관리자용 전체 주문 목록
    public function index(Request $request)
    {
        $query = Order::with(['user', 'product']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => '주문이 삭제되었습니다.']);
    }

    public function exportCsv()
    {
        $orders = Order::with(['user', 'product'])->get();

        $csv = "ID,User,Product,Quantity,Total,Status,Date\n";
        foreach ($orders as $o) {
            $csv .= "{$o->id},{$o->user->name},{$o->product->name},{$o->quantity},{$o->total_price},{$o->status},{$o->created_at}\n";
        }

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders.csv"',
        ]);
    }

    // 상태 업데이트
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => '상태가 업데이트되었습니다.', 'order' => $order]);
    }
}
