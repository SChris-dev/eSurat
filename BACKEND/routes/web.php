<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/download/{filename}', function ($filename) {
    $path = public_path("uploads/{$filename}");

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->download($path);
});

