<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // ✅ 이 줄 추가!

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        Log::info('Admin middleware check', [
            'id' => optional($user)->id,
            'email' => optional($user)->email,
            'is_admin' => optional($user)->is_admin,
        ]);

        if (!$user || !$user->is_admin) {
            return response()->json(['message' => '관리자만 접근 가능합니다.'], 403);
        }

        return $next($request);
    }
}
