const RULE_NAME = 'BRUTE_FORCE_SUSPECTED';
const THRESHOLD = 5;
const TIME_WINDOW_MS = 5 * 60 * 1000; 

const evaluate = (events) => {
    const alerts = [];

    const authFailures = events.filter(e => e.eventType === 'AUTH_FAILURE' && e.actor?.username);

    const failuresByUser = {};
    authFailures.forEach(event => {
        const user = event.actor.username;
        if (!failuresByUser[user]) {
            failuresByUser[user] = [];
        }
        failuresByUser[user].push(event);
    });

    for (const [username, userEvents] of Object.entries(failuresByUser)) {
        userEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        for (let i = 0; i <= userEvents.length - THRESHOLD; i++) {
            const firstFailureTime = new Date(userEvents[i].timestamp).getTime();
            const fifthFailureTime = new Date(userEvents[i + THRESHOLD - 1].timestamp).getTime();

            if (fifthFailureTime - firstFailureTime <= TIME_WINDOW_MS) {
                const sourceEvents = userEvents.slice(i, i + THRESHOLD).map(e => e.eventId);

                alerts.push({
                    title: `Multiple Failed Logins Detected: ${username}`,
                    description: `Detected a burst of ${THRESHOLD} failed login attempts for user '${username}' within a 5-minute window.`,
                    severity: 'high',
                    ruleName: RULE_NAME,
                    entity: username,
                    sourceEvents: sourceEvents
                });
                break; 
            }
        }
    }

    return alerts;
};

module.exports = {
    ruleName: RULE_NAME,
    evaluate
};
