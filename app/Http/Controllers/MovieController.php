<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovieController extends Controller
{
    public function index()
    {
        return Inertia::render('Movie/Movie', [
            'token' => env('MOVIE_ACCESS_TOKEN'),
        ]);
    }

    public function detail(int $movieId)
    {
        return Inertia::render('Movie/DetailMovie', [
            'token' => env('MOVIE_ACCESS_TOKEN'),
            'movieId' => $movieId,
            'movie' => Movie::whereMovieId($movieId)->whereUserId(auth()->user()->id)->first(),
        ]);
    }

    public function create(Request $request)
    {
        $movieId = $request->input('movie_id');
        $title = $request->input('title');
        $photo = $request->file('photo');

        $data = [
            'movie_id' => $movieId,
            'user_id' => auth()->user()->id,
            'title' => $title,
            'photo' => pathinfo($photo->store('public/images/movies'))['basename'],
        ];

        Movie::create($data);

        return redirect()->route('movie.detail', $movieId)->with('toast', 'Success add photo!');
    }

    public function update(Movie $movie, Request $request)
    {
        $movieId = $request->input('movie_id');
        $title = $request->input('title');
        $photo = $request->file('photo');

        $data = [
            'movie_id' => $movieId,
            'user_id' => auth()->user()->id,
            'title' => $title,
            'photo' => pathinfo($photo->store('public/images/movies'))['basename'],
        ];

        $movie->update($data);

        return redirect()->route('movie.detail', $movieId)->with('toast', 'Success updated photo!');
    }
}
