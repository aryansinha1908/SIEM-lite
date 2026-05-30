require('dotenv').config();
const { startEngineLoop } = require('./scheduler/index.scheduler.js');

const start = async () => {
    console.log('==========================================');
    console.log('🛡️  SIEM DETECTION ENGINE STARTING 🛡️');
    console.log('==========================================');

    if (!process.env.BACKEND_URL) {
        console.error('[FATAL] BACKEND_URL is not defined in .env');
        console.error('[FATAL] The engine cannot reach the Express backend. Exiting...');
        process.exit(1);
    }

    console.log(`[CONFIG] Backend API Target: ${process.env.BACKEND_URL}`);
    console.log(`[CONFIG] Polling Interval: ${process.env.POLL_INTERVAL_MS || 5000}ms\n`);

    // 2. Start the infinite scheduler loop
    try {
        // This function runs forever until the process is killed
        await startEngineLoop();
    } catch (error) {
        console.error('[FATAL] Engine loop crashed unexpectedly:', error);
        process.exit(1);
    }
};

// 3. Graceful Shutdown Handlers
// These ensure the engine stops cleanly if you press Ctrl+C or kill the Docker container
process.on('SIGINT', () => {
    console.log('\n[SHUTDOWN] Detection Engine stopping gracefully (SIGINT)...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[SHUTDOWN] Detection Engine stopping gracefully (SIGTERM)...');
    process.exit(0);
});

// Boot up
start();
