<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'status', 'total_price'];

    // ✅ 주문한 사용자
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ✅ 주문의 상세 항목들
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
