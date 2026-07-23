<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['asset_id', 'type', 'quantity', 'price_per_unit', 'fee', 'transaction_date'];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}