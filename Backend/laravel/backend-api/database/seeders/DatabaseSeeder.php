<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Report;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Teszt Felhasználó',
            'email' => 'teszt@example.com',
            'password' => Hash::make('123') 
        ]);

        Report::create([
            'subsystem' => 'Térkép',
            'text' => 'Probléma a térképpel',
            'date' => now(),
            'status' => 'nyitott',
            'creator_id' => $user->id
        ]);
    }
}
