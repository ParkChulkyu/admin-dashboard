<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // 유저 전체 목록 반환 (관리자 전용)
    public function index(Request $request)
    {
        $query = User::query();

        // ✅ 검색어가 있으면 name 또는 email에서 찾기
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // ✅ 관리자만 필터
        if ($request->boolean('admin_only')) {
            $query->where('is_admin', true);
        }

        $perPage = 10; // 페이지당 항목 수
        return response()->json($query
            ->select('id', 'name', 'email', 'is_admin')
            ->orderBy('id', 'asc')
            ->paginate($perPage));
    }

    // 관리자 권한 토글
    public function toggleRole(Request $request, $id)
    {
        $request->validate([
            'is_admin' => 'required|boolean', // ✅ true/false 유효성 검사
        ]);

        $user = User::findOrFail($id);
        $user->is_admin = $request->is_admin;
        $user->save();

        return response()->json([
            'message' => '권한이 변경되었습니다.',
            'is_admin' => $user->is_admin,
        ]);
    }
}
