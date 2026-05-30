import api from "../api/axios.js";

export const getEvents = async (filters) => {
    try {
        const response = await api.get("/events/", { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
    }
};

export const getEvent = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Event: ", error);
        throw error;
    }
};

export const getAlert = async (alertId) => {
    try {
        const response = await api.get(`/alerts/${alertId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Event: ", error);
        throw error;
    }
};

export const getAlerts = async () => {
    try {
        const response = await api.get(`/alerts/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Event: ", error);
        throw error;
    }
};

export const updateAlert = async (alertId, updateData) => {
    try {
        const response = await api.patch(`/alerts/${alertId}`, updateData);
        return response.data;
    } catch (error) {
        console.error("Error fetching Event: ", error);
        throw error;
    }
};
