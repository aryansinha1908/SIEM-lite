const fs = require('fs');
const path = require('path');

const rules = [];
const rulesDir = path.join(__dirname, '../rules');

console.log('[ENGINE] Scanning for detection rules...');
fs.readdirSync(rulesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const rule = require(path.join(rulesDir, file));
        
        if (rule.ruleName && typeof rule.evaluate === 'function') {
            rules.push(rule);
            console.log(`[ENGINE] Loaded rule: ${rule.ruleName}`);
        } else {
            console.warn(`[ENGINE] Ignored invalid rule file: ${file}`);
        }
    }
});

const runDetectionRules = (events) => {
    let allGeneratedAlerts = [];

    for (const rule of rules) {
        try {
            const ruleAlerts = rule.evaluate(events);
            
            if (ruleAlerts && ruleAlerts.length > 0) {
                allGeneratedAlerts.push(...ruleAlerts);
            }
        } catch (error) {
            console.error(`[ENGINE] Error executing rule '${rule.ruleName}':`, error.message);
        }
    }

    return allGeneratedAlerts;
};

module.exports = { runDetectionRules };
