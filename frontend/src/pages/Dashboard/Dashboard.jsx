import "./Dashboard.css";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { getEvents } from "../../services/api.js";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getEvents(filters);
            setEvents(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to Load Telemetry Data: ", error);
        } finally {
            setLoading(false);
        }
    }

    const getSeverityClass = (severity) => {
        const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
        return validSeverities.includes(severity) ? `badge-${severity}` : 'badge-info';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>
                    <Activity className="header-icon" />
                    Security Telemetry
                </h1>
                <div className="event-count">
                    Total Events: {meta.total || 0}
                </div>
            </header>

            <div className="table-wrapper">
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Severity</th>
                            <th>Event Type</th>
                            <th>Source System</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="loading-cell">Scanning Logs...</td></tr>
                        ) : (
                            events.map((event) => {
                                return (
                                    <tr key={event.eventId}>
                                        <td className="timestamp">
                                            {format(new Date(event.timestamp), 'yyyy-MM-dd HH-mm-ss')}
                                        </td>
                                        <td>
                                            <span className={`badge ${getSeverityClass(event.severity)}`}>
                                                {event.severity}
                                            </span>
                                        </td>
                                        <td className="event-type">{event.eventType}</td>
                                        <td className="source-system">{event.source?.system}</td>
                                        <td className="action-call">{event.action}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button 
                    disabled={meta.page === 1}
                    onClick={() => setFilters({ ...filters, page: meta.page - 1})}
                >
                    &larr; Previous
                </button>
                <span>Page {meta.page} of {meta.totalPages || 1}</span>
                <button 
                    disabled={meta.page === meta.totalPages || !meta.totalPages}
                    onClick={() => setFilters({ ...filters, page: meta.page + 1})}
                >
                    Next &rarr; 
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
