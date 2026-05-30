const { fetchNewEvents, createAlert } = require('../services/api.service.js');
const { getState, saveState } = require('../services/stateManager.service.js');
const { runDetectionRules } = require('../core/engine.core.js'); 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startEngineLoop = async () => {
    console.log('[SCHEDULER] API-Driven Engine initialized. Starting polling loop...');
    
    const pollInterval = process.env.POLL_INTERVAL_MS || 5000;

    while (true) {
        try {
            const state = getState();
            
            const newEvents = await fetchNewEvents(state.lastProcessedTimestamp, 1000);

            console.log(`[SCHEDULER] Polled API. Found ${newEvents ? newEvents.length : 0} events.`);

            if (newEvents && newEvents.length > 0) {
                console.log(`[SCHEDULER] Fetched ${newEvents.length} new events. Analyzing...`);

                const generatedAlerts = runDetectionRules(newEvents);

                if (generatedAlerts.length > 0) {
                    console.log(`[SCHEDULER] 🚨 Generated ${generatedAlerts.length} new alerts. Sending to backend...`);
                    
                    for (const alert of generatedAlerts) {
                        await createAlert(alert);
                    }
                }

                const lastEvent = newEvents[newEvents.length - 1];
                if (lastEvent && lastEvent.timestamp) {
                    saveState(lastEvent.timestamp);
                }
            }

        } catch (error) {
            console.error('[SCHEDULER] Cycle failed. Retrying in 5s...', error.message);
        }

        await sleep(pollInterval);
    }
};

module.exports = { startEngineLoop };
