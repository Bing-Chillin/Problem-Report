<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::middleware('auth:api')->group(function () { 
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/my-reports', [ReportController::class, 'myReports']);
    Route::get('/my-reports/{id}/image', [ReportController::class, 'showMyImage']);

    // Admin, Developer and Dispatcher only
    Route::middleware('role:admin,developer,dispatcher')->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/reports/{id}/image', [ReportController::class, 'showImage']);
        Route::put('/reports/{id}', [ReportController::class, 'update']);
    });
    
    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
    });
});


Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login', [AuthController::class, 'login'])->name('login');

Route::delete('/users/{id}', [UserController::class, 'destroy']);