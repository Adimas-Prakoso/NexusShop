<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class TestProductionMode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:production-mode {--toggle : Toggle between sandbox and production mode}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test and toggle between Midtrans sandbox and production mode';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('toggle')) {
            $this->toggleMode();
        } else {
            $this->showCurrentConfiguration();
        }
        
        return Command::SUCCESS;
    }
    
    private function showCurrentConfiguration()
    {
        $this->info('🔧 Current Midtrans Configuration');
        $this->info('===============================');
        
        $isSandbox = config('services.midtrans.sandbox', true);
        $mode = $isSandbox ? 'SANDBOX' : 'PRODUCTION';
        
        $this->line("Current Mode: <fg=yellow>{$mode}</>");
        $this->line("");
        
        // Show environment variables
        $this->info('📋 Environment Variables:');
        $this->line("MIDTRANS_SANDBOX=" . (env('MIDTRANS_SANDBOX', 'true') ? 'true' : 'false'));
        $this->line("");
        
        // Show configuration values
        $this->info('⚙️  Configuration Values:');
        
        if ($isSandbox) {
            $serverKey = config('services.midtrans.sandbox_server_key');
            $clientKey = config('services.midtrans.sandbox_client_key');
            $this->line("Server Key: " . ($serverKey ? substr($serverKey, 0, 20) . '...' : 'NOT SET'));
            $this->line("Client Key: " . ($clientKey ? substr($clientKey, 0, 20) . '...' : 'NOT SET'));
            $this->line("API URL: https://api.sandbox.midtrans.com/v2");
        } else {
            $serverKey = config('services.midtrans.production_server_key');
            $clientKey = config('services.midtrans.production_client_key');
            $this->line("Server Key: " . ($serverKey ? substr($serverKey, 0, 20) . '...' : 'NOT SET'));
            $this->line("Client Key: " . ($clientKey ? substr($clientKey, 0, 20) . '...' : 'NOT SET'));
            $this->line("API URL: https://api.midtrans.com/v2");
        }
        
        $this->line("");
        
        // Show warnings
        if ($isSandbox) {
            $this->warn('⚠️  Currently in SANDBOX mode - transactions are for testing only');
        } else {
            $this->error('🚨 Currently in PRODUCTION mode - real transactions will be processed');
        }
        
        $this->line("");
        $this->info('💡 To toggle mode, use: php artisan test:production-mode --toggle');
    }
    
    private function toggleMode()
    {
        $envPath = base_path('.env');
        
        if (!file_exists($envPath)) {
            $this->error('❌ .env file not found');
            return;
        }
        
        $envContent = file_get_contents($envPath);
        $currentSandbox = env('MIDTRANS_SANDBOX', 'true');
        
        if ($currentSandbox === 'true' || $currentSandbox === true) {
            // Switch to production
            $newContent = str_replace(
                'MIDTRANS_SANDBOX=true',
                'MIDTRANS_SANDBOX=false',
                $envContent
            );
            $newMode = 'PRODUCTION';
            $this->warn('🚨 Switching to PRODUCTION mode');
        } else {
            // Switch to sandbox
            $newContent = str_replace(
                'MIDTRANS_SANDBOX=false',
                'MIDTRANS_SANDBOX=true',
                $envContent
            );
            $newMode = 'SANDBOX';
            $this->info('🧪 Switching to SANDBOX mode');
        }
        
        if ($newContent !== $envContent) {
            file_put_contents($envPath, $newContent);
            
            $this->line("");
            $this->info("✅ Successfully switched to {$newMode} mode");
            $this->line("");
            
            // Clear config cache
            $this->call('config:clear');
            
            $this->info('📋 Updated Configuration:');
            $this->showCurrentConfiguration();
            
            if ($newMode === 'PRODUCTION') {
                $this->line("");
                $this->error('🚨 WARNING: You are now in PRODUCTION mode!');
                $this->error('   Real transactions will be processed.');
                $this->error('   Make sure you have valid production credentials.');
            }
        } else {
            $this->error('❌ Failed to update .env file');
        }
    }
}
