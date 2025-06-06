<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // 유저 전체 목록 반환 (관리자 전용)
    public function index(Request $request)
    {
        $user = Auth::user();

        // 🔒 관리자만 접근 가능하게 막기
        if (!$user || !$user->is_admin) {
            return response()->json(['message' => '관리자만 접근 가능합니다.'], 403);
        }

        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('admin_only')) {
            $query->where('is_admin', true);
        }

        $perPage = 10;
        return response()->json($query
            ->select('id', 'name', 'email', 'is_admin')
            ->orderBy('id', 'asc')
            ->paginate($perPage));
    }

    // 관리자 권한 토글
    public function toggleRole(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return response()->json(['message' => '관리자만 접근 가능합니다.'], 403);
        }

        $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $targetUser = User::findOrFail($id);
        $targetUser->is_admin = $request->is_admin;
        $targetUser->save();

        return response()->json([
            'message' => '권한이 변경되었습니다.',
            'is_admin' => $targetUser->is_admin,
        ]);
    }
}
