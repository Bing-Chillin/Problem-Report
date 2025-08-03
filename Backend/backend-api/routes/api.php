<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::middleware('auth:api')->apiResource('reports', ReportController::class);

Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login', [AuthController::class, 'login'])->name('login');

Route::delete('/users/{id}', [UserController::class, 'destroy']);