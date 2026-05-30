const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '../../engine-state.json');

const getState = () => {
    if (!fs.existsSync(STATE_FILE)) {
        console.log('[STATE] No state file found. Creating a new one...');
        const initialState = { lastProcessedTimestamp: new Date().toISOString() };
        
        fs.writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
        
        return initialState;
    }
    const data = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(data);
};

const saveState = (timestamp) => {
    const data = JSON.stringify({ lastProcessedTimestamp: timestamp }, null, 2);
    fs.writeFileSync(STATE_FILE, data);
};

module.exports = { getState, saveState };
