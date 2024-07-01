<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //        $user = [];
        //
        //        for ($i = 0; $i < 10; $i++) {
        //            $user[] = [
        //                'name' => 'User '.$i,
        //                'email' => 'user'.$i.'@example.com',
        //                'password' => Hash::make(12345678),
        //            ];
        //        }
        //
        //        $role = Role::whereName('user')->first();

        $movie = [[
            'movie_id' => 704673,
            'title' => 'Trigger Warning',
            'photo' => 'ZBN07qFJjmbt2bYzUXaLqb7ZNsunZa37HYE1L5hk.png',
        ]];

        foreach ($movie as $m) {
            $m['user_id'] = 10;
            Movie::create($m);
        }
    }
}
