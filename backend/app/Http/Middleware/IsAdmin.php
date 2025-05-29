<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return $next($request);
        }

        return response()->json(['message' => '관리자만 접근 가능합니다.'], 403);
    }
}
