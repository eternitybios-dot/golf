import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

export default defineConfig({
  testDir:'./e2e',fullyParallel:false,workers:1,timeout:30000,
  use:{baseURL:'http://127.0.0.1:4173/golf/',headless:true,viewport:{width:1440,height:1050},
    launchOptions:existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}:undefined,
    screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'npm run preview -- --port 4173',url:'http://127.0.0.1:4173/golf/',reuseExistingServer:!process.env.CI},
});
