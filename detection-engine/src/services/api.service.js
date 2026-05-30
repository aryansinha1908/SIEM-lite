const axios = require("axios");

const apiClient = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchNewEvents = async (sinceTimeStamp, limit = 1000) => {
    try {
        const response = await apiClient.get("/events", {
            params: {
                startDate: sinceTimeStamp,
                limit: limit,
                sort: 'asc'
            }
        });

        return response.data.data;
    } catch (error) {
        console.error(`[API] Failed to fetch Events: `, error.message);
        return [];
    }
};

const createAlert = async (alertData) => {
    try {
        const response = await apiClient.post('/alerts', alertData);
        return response.data.data;
    } catch (error) {
        console.error('[API] Failed to create alert:', error.message);
        return null;
    }
};

module.exports = { fetchNewEvents, createAlert };
