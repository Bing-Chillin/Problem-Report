<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

//for http requests
Route::middleware('auth:api')->apiResource('reports', ReportController::class);

//for authentication
Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login', [AuthController::class, 'login'])->name('login');