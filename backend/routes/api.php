<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    $user = \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => $user,
    ]);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return response()->json([
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => $user,
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin, // ✅ 프론트에서 확인 가능
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => '로그아웃 완료']);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->get('/admin/dashboard', function () {
    return response()->json([
        'product_count' => \App\Models\Product::count(),
        'order_count' => \App\Models\Order::count(),
        'user_count' => \App\Models\User::count(),
        'recent_orders' => \App\Models\Order::with(['user', 'product'])
                            ->orderBy('created_at', 'desc')
                            ->take(5)->get(),
    ]);
});

// TB_product에 해당하는 부분 미들웨어 생성
Route::middleware('auth:sanctum')->prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);

    // ⛔ 관리자만 가능
    Route::middleware('admin')->group(function () {
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });
});

// 주문 및 주문 취소에 해당하는 부분 미들웨어 생성
Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);         // 주문 전체 조회
    Route::post('/', [OrderController::class, 'store']);        // ✅ 주문 등록 ← 이게 핵심!
    Route::get('/{id}', [OrderController::class, 'show']);      // 주문 상세
    Route::put('/{id}', [OrderController::class, 'update']);    // 상태 변경
    Route::delete('/{id}', [OrderController::class, 'destroy']); // 주문 삭제
});

// 모든 유저 목록 가져오기 (관리자만)
Route::middleware(['auth:sanctum', 'admin'])->get('/users', [UserController::class, 'index']);

// 사용자 관리 (관리자 전용)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']); // 유저 목록
    Route::put('/users/{id}/role', [UserController::class, 'toggleRole']); // 역할 토글
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('products', AdminProductController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/orders', [AdminOrderController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});