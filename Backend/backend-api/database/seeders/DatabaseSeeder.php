<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Report;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'first_name' => 'Felhasználó',
            'last_name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('123') ,
            'role_id' => 1 
        ]);

        User::create([
            'first_name' => 'Felhasználó',
            'last_name' => 'Developer',
            'username' => 'developer',
            'email' => 'developer@example.com',
            'password' => Hash::make('123'),
            'role_id' => 2
        ]);

        $user = User::create([
            'first_name' => 'Felhasználó',
            'last_name' => 'Teszt',
            'username' => 'testuser',
            'email' => 'testuser@example.com',
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
