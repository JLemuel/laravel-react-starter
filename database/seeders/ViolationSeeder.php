<?php

namespace Database\Seeders;

use App\Models\Violation;
use Illuminate\Database\Seeder;

class ViolationSeeder extends Seeder
{
    public function run(): void
    {
        $violations = [
            [
                'name' => 'Anti-Road Obstruction Ordinance',
                'ordinance_number' => 'Ordinance No. 230-2020',
                'penalties' => [
                    ['offense' => 'First', 'amount' => 2000],
                    ['offense' => 'Second', 'amount' => 3000],
                    ['offense' => 'Third', 'amount' => 5000],
                ]
            ],
            [
                'name' => 'Road Warning & Safety Device Ordinance',
                'ordinance_number' => 'Ordinance No. 229-2020',
                'penalties' => [
                    ['offense' => 'First', 'amount' => 2000],
                    ['offense' => 'Second', 'amount' => 3000],
                    ['offense' => 'Third', 'amount' => 5000],
                ]
            ],
            [
                'name' => 'High Visibility Vest Ordinance',
                'ordinance_number' => 'Ordinance No. 132-2018',
                'penalties' => [
                    ['offense' => 'First', 'amount' => 2000],
                    ['offense' => 'Second', 'amount' => 3000],
                    ['offense' => 'Third', 'amount' => 5000],
                ]
            ],
            [
                'name' => 'No Cover (Trapal) Ordinance',
                'ordinance_number' => 'Ordinance No. 111-2017',
                'penalties' => [
                    ['offense' => 'First', 'amount' => 2000],
                    ['offense' => 'Second', 'amount' => 3000],
                    ['offense' => 'Third', 'amount' => 5000],
                ]
            ],
            [
                'name' => 'Sand and Gravel Ordinance',
                'ordinance_number' => 'Ordinance No. 274-2021',
                'penalties' => [
                    ['offense' => 'First', 'amount' => 2000],
                    ['offense' => 'Second', 'amount' => 3000],
                    ['offense' => 'Third', 'amount' => 5000],
                ]
            ],
        ];

        foreach ($violations as $violation) {
            Violation::create($violation);
        }
    }
} 