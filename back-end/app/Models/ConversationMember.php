<?php

namespace App\Models;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversationMember extends Model
{
    use HasFactory;
    protected $table="conv_members";


    public $incrementing = false;
    protected $guarded = []; // YOLO
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->{$post->getKeyName()} = (string) Str::uuid();
        });
    }
    protected $casts = [
        'id' => 'string',
    ];

    protected $primaryKey = "id";
}
