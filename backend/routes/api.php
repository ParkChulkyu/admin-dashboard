<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Models\User;

// 🔐 회원가입
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => $user,
    ]);
});

// 🔐 로그인
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

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

// 🔐 인증된 사용자 정보 / 로그아웃
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => '로그아웃 완료']);
    });
});


// -------------------------------
// 🛍️ 일반 사용자 API
// -------------------------------

Route::middleware('auth:sanctum')->group(function () {
    // 📦 상품
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);     // 상품 목록
        Route::get('/{id}', [ProductController::class, 'show']);  // 상품 상세

        Route::middleware('admin')->group(function () {
            Route::post('/', [ProductController::class, 'store']);    // 상품 등록
            Route::put('/{id}', [ProductController::class, 'update']); // 상품 수정
            Route::delete('/{id}', [ProductController::class, 'destroy']); // 상품 삭제
        });
    });

    // 🧾 주문
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);         // 내 주문 목록
        Route::post('/', [OrderController::class, 'store']);        // 주문 생성
        Route::get('/{id}', [OrderController::class, 'show']);      // 주문 상세
        Route::put('/{id}', [OrderController::class, 'update']);    // 주문 상태 변경
        Route::delete('/{id}', [OrderController::class, 'destroy']); // 주문 취소
    });
});


// -------------------------------
// 🛠️ 관리자 전용 API (admin middleware 적용)
// -------------------------------

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // 관리자 대시보드
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // 상품 관리 (Admin 전용)
    Route::apiResource('products', AdminProductController::class);

    // 주문 관리
    Route::get('/orders', [AdminOrderController::class, 'index']);

    Route::put('/orders/{id}', [AdminOrderController::class, 'update']);

    Route::delete('/orders/{id}', [AdminOrderController::class, 'destroy']);

    Route::get('/orders/export', [AdminOrderController::class, 'exportCsv']);
});

// 관리자 전용 사용자 관리
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);              // 전체 유저 목록
    Route::put('/users/{id}/role', [UserController::class, 'toggleRole']); // 역할 변경
});


// -------------------------------
// 🌐 비로그인 사용자도 접근 가능한 공개 API
// -------------------------------

Route::get('/products', [ProductController::class, 'index']);     // 상품 목록
Route::get('/products/{id}', [ProductController::class, 'show']); // 상품 상세

Route::get('/admin/orders/export-pdf', [AdminOrderController::class, 'exportPdf']);