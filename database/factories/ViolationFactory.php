<?php

namespace Database\Factories;

use App\Models\Violation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ViolationFactory extends Factory
{
    protected $model = Violation::class;

    public function definition(): array
    {
        $violations = [
            [
                'name' => 'Anti-Road Obstruction Ordinance',
                'ordinance_number' => 'Ordinance No. 230-2020'
            ],
            [
                'name' => 'Road Warning & Safety Device Ordinance',
                'ordinance_number' => 'Ordinance No. 229-2020'
            ],
            [
                'name' => 'High Visibility Vest Ordinance',
                'ordinance_number' => 'Ordinance No. 132-2018'
            ],
            [
                'name' => 'No Cover (Trapal) Ordinance',
                'ordinance_number' => 'Ordinance No. 111-2017'
            ],
            [
                'name' => 'Sand and Gravel Ordinance',
                'ordinance_number' => 'Ordinance No. 274-2021'
            ],
        ];

        return $this->faker->randomElement($violations);
    }
} 