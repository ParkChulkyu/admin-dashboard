<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 전체 주문 목록 (관리자만 사용 가능)
    public function index()
    {
        // 전체 주문 + 사용자 + 상품정보까지 포함해서 가져오기
        $orders = Order::with('items.product', 'user')->get();
        return response()->json($orders);
    }

    // 주문 등록
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        $total = 0;
        $itemsData = [];

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $price = $product->price;
            $quantity = $item['quantity'];
            $total += $price * $quantity;

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $price,
            ];
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total_price' => $total,
            ]);

            foreach ($itemsData as $data) {
                $data['order_id'] = $order->id;
                OrderItem::create($data);
            }

            DB::commit();

            return response()->json([
                'message' => '주문이 완료되었습니다.',
                'order_id' => $order->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '주문 생성 실패',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // 주문 상세
    public function show($id)
    {
        $order = Order::with('items.product', 'user')->find($id);
        if (!$order) {
            return response()->json(['message' => '주문을 찾을 수 없습니다.'], 404);
        }
        return response()->json($order);
    }

    // 주문 상태 변경 (예: 배송중, 완료)
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,canceled',
        ]);

        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => '주문을 찾을 수 없습니다.'], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json($order);
    }

    // 주문 삭제 (취소)
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => '주문을 찾을 수 없습니다.'], 404);
        }

        $order->delete();

        return response()->json(['message' => '주문이 삭제되었습니다.']);
    }
}
