<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;

Route::apiResource('reports', ReportController::class);

Route::get('/ping', function () {
    return 'pong';
});
