<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $users = User::query()->latest('id')->get();

    return view('landing', compact('users'));
});
