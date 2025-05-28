<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

    // ✅ 이 항목이 속한 주문
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // ✅ 이 항목이 어떤 상품인지
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
