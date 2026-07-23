<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_shows_users_in_a_table(): void
    {
        $users = User::factory()->count(2)->create();

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Nama');
        $response->assertSee('Email');
        $response->assertSee($users[0]->name);
        $response->assertSee($users[0]->email);
        $response->assertSee($users[1]->name);
        $response->assertSee($users[1]->email);
    }
}
