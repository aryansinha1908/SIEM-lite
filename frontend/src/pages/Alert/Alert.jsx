import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlert, updateAlert } from '../../services/api';
import { format } from 'date-fns';
import { ArrowLeft, ShieldAlert, Target, Activity, CheckCircle } from 'lucide-react';
import './Alert.css'; 

export default function Alert() {
    const { alertId } = useParams(); 
    const navigate = useNavigate();
    
    const [alertData, setAlertData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const data = await getAlert(alertId);
                setAlertData(data.data);
            } catch (err) {
                setError("Could not locate this alert record.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlert();
    }, [alertId]);

    const handleStatusChange = async (newStatus) => {
        try {
            await updateAlert(alertId, { status: newStatus });
            setAlertData({ ...alertData, status: newStatus }); 
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getSeverityClass = (severity) => {
        const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
        return validSeverities.includes(severity) ? `badge-${severity}` : 'badge-info';
    };

    if (loading) return <div className="details-container loading">Loading Incident Data...</div>;
    if (error) return <div className="details-container error"><h2>404</h2><p>{error}</p></div>;
    if (!alertData) return null;

    return (
        <div className="details-container">
            <header className="details-header">
                <button className="back-btn" onClick={() => navigate('/alerts')}>
                    <ArrowLeft size={18} /> Back to Alerts
                </button>
                <div className="title-row" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <h1>{alertData.title}</h1>
                        <span className={`badge ${getSeverityClass(alertData.severity)}`}>
                            {alertData.severity}
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                            STATUS: {alertData.status.toUpperCase()}
                        </span>
                        {alertData.status !== 'resolved' && (
                            <button 
                                onClick={() => handleStatusChange('resolved')}
                                style={{
                                    background: 'var(--sev-low-bg)',
                                    border: '1px solid var(--sev-low-border)',
                                    color: 'var(--sev-low-text)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.75rem'
                                }}
                            >
                                <CheckCircle size={14} /> Mark Resolved
                            </button>
                        )}
                    </div>
                </div>
                <div className="timestamp-subtitle">
                    Alert ID: {alertData.alertId} | Generated: {format(new Date(alertData.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </div>
            </header>

            <div className="info-grid">
                <div className="info-card">
                    <h3><ShieldAlert size={18} /> Incident Details</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                        {alertData.description}
                    </p>
                    <div className="kv-pair"><span className="key">Detection Rule:</span> <span className="value text-accent">{alertData.ruleName}</span></div>
                </div>

                <div className="info-card">
                    <h3><Target size={18} /> Threat Target</h3>
                    <div className="kv-pair"><span className="key">Entity Involved:</span> <span className="value text-accent">{alertData.entity}</span></div>
                    <div className="kv-pair"><span className="key">Last Updated:</span> <span className="value">{format(new Date(alertData.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</span></div>
                </div>
            </div>

            <div className="raw-data-section">
                <h3><Activity size={18} /> Source Telemetry Events</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    The following raw events triggered this alert. Click an Event ID to view the full JSON payload.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {alertData.sourceEvents?.length > 0 ? (
                        alertData.sourceEvents.map(eventId => (
                            <div 
                                key={eventId}
                                onClick={() => navigate(`/event/${eventId}`)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'var(--bg-main)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Fira Code, monospace',
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-primary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            >
                                {eventId}
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>View Details &rarr;</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-muted)' }}>No source events linked to this alert.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
