<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use App\Models\Movie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    if (auth()->user()->hasPermissionTo('view_dashboard') === false) {
        return redirect()->route('movie.index');
    }

    $movie = Movie::select(['movie_id', 'title', DB::raw('count(*)')])
        ->groupBy(['movie_id', 'title'])
        ->orderBy(DB::raw('count(*)'))
        ->limit(5)
        ->get();

    return Inertia::render('Dashboard', [
        'data' => [
            'categories' => $movie->pluck('title'),
            'series' => $movie->pluck('count'),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/movies', [MovieController::class, 'index'])->name('movie.index');
    Route::get('/movies/{movieId}', [MovieController::class, 'detail'])->name('movie.detail');
    Route::post('/movies', [MovieController::class, 'create'])->name('movie.create');
    Route::post('/movies/{movie}', [MovieController::class, 'update'])->name('movie.update');
});

require __DIR__.'/auth.php';
