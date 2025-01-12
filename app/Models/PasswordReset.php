<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'email';

    protected $fillable = [
        'email', 'token'
    ];
}
