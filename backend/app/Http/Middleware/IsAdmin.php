<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // 로그인된 유저가 관리자 아니면 403 금지
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => '관리자만 접근 가능합니다.'], 403);
        }

        return $next($request);
    }
}
