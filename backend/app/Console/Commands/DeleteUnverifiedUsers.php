<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Carbon\Carbon;

class DeleteUnverifiedUsers extends Command
{
    protected $signature = 'users:delete-unverified';
    protected $description = 'Delete users who have not verified their email after 7 days';

    public function handle()
    {
        $deletedCount = User::whereNull('email_verified_at')
            ->where('created_at', '<', Carbon::now()->subDays(7))
            ->delete();

        $this->info("Deleted {$deletedCount} unverified users.");
        
        return 0;
    }
}