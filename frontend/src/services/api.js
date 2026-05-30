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
