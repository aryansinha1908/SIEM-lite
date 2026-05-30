import './Event.css';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { getEvent } from '../../services/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Monitor, User, Server } from 'lucide-react';

const Event = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getEvent(eventId);
                setEvent(response.data);
            } catch (error) {
                setError("Could not locate this event record");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const getSeverityClass = (severity) => {
        const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
        return validSeverities.includes(severity) ? `badge-${severity}` : 'badge-info';
    };

    if (loading) return <div className="details-container loading">Decrypting Logs...</div>;
    if (error) return <div className="details-container error"><h2>404</h2><p>{error}</p></div>;
    if (!event) return null;

    return (
        <div className="details-container">
            <header className="details-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <div className="title-row">
                    <h1>Event: {event.eventId}</h1>
                    <span className={`badge ${getSeverityClass(event.severity)}`}>
                        {event.severity}
                    </span>
                </div>
                <div className="timestamp-subtitle">
                    {format(new Date(event.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS')}
                </div>
            </header>

            <div className="info-grid">
                
                <div className="info-card">
                    <h3><ShieldAlert size={18} /> Overview</h3>
                    <div className="kv-pair"><span className="key">Event Type:</span> <span className="value text-accent">{event.eventType}</span></div>
                    <div className="kv-pair"><span className="key">Action:</span> <span className="value">{event.action}</span></div>
                    <div className="kv-pair"><span className="key">Outcome:</span> <span className="value">{event.outcome}</span></div>
                    <div className="kv-pair"><span className="key">Category:</span> <span className="value">{event.category || 'N/A'}</span></div>
                </div>

                <div className="info-card">
                    <h3><Server size={18} /> Source System</h3>
                    <div className="kv-pair"><span className="key">System:</span> <span className="value">{event.source?.system || 'Unknown'}</span></div>
                    <div className="kv-pair"><span className="key">IP Address:</span> <span className="value text-accent">{event.source?.ip || 'N/A'}</span></div>
                    <div className="kv-pair"><span className="key">Hostname:</span> <span className="value">{event.source?.hostname || 'N/A'}</span></div>
                </div>

                <div className="info-card">
                    <h3><User size={18} /> Actor / User</h3>
                    <div className="kv-pair"><span className="key">Username:</span> <span className="value">{event.actor?.username || 'System Account'}</span></div>
                    <div className="kv-pair"><span className="key">Source IP:</span> <span className="value text-accent">{event.actor?.ip || 'N/A'}</span></div>
                    <div className="kv-pair"><span className="key">User Agent:</span> <span className="value small-text">{event.actor?.userAgent || 'N/A'}</span></div>
                </div>

            </div>

            <div className="raw-data-section">
                <h3><Monitor size={18} /> Raw Telemetry Data</h3>
                <pre className="json-viewer">
                    {JSON.stringify(event, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default Event;
