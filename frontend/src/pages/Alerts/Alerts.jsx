import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ShieldAlert, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAlerts, updateAlert } from '../../services/api';
import './Alerts.css'; 

export default function Alerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await getAlerts();
            setAlerts(response.data || []);
        } catch (error) {
            console.error("Failed to load alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (alertId, newStatus) => {
        try {
            await updateAlert(alertId, { status: newStatus });
            
            setAlerts(alerts.map(alert => 
                alert.alertId === alertId ? { ...alert, status: newStatus } : alert
            ));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update alert status.");
        }
    };

    const getSeverityClass = (severity) => {
        const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
        return validSeverities.includes(severity) ? `badge-${severity}` : 'badge-info';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <button className="back-btn" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back to Telemetry
                    </button>
                    <h1>
                        <ShieldAlert className="header-icon" style={{ color: 'var(--sev-critical-text)' }} />
                        Active Threat Alerts
                    </h1>
                </div>
            </header>

            <div className="table-wrapper">
                <table className="events-table">
                    <thead>
                        <tr                        >
                            <th>Generated</th>
                            <th>Severity</th>
                            <th>Title / Rule</th>
                            <th>Target Entity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="loading-cell">Scanning for threats...</td></tr>
                        ) : alerts.length === 0 ? (
                            <tr><td colSpan="6" className="loading-cell" style={{ color: 'var(--sev-low-text)' }}>No active alerts. Your systems are secure.</td></tr>
                        ) : (
                            alerts.map((alert) => (
                                <tr 
                                    key={alert.alertId}
                                    onClick={() => navigate(`/alerts/${alert.alertId}`)}
                                    style={{ cursor: 'pointer' }} // Add a pointer so they know it's clickable
                                >
                                    <td className="timestamp">
                                        {format(new Date(alert.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </td>
                                    <td>
                                        <span className={`badge ${getSeverityClass(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{alert.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.ruleName}</div>
                                    </td>
                                    <td className="action-cell">{alert.entity}</td>
                                    <td>
                                        <span className="badge" style={{ 
                                            backgroundColor: alert.status === 'resolved' ? 'rgba(0, 143, 119, 0.15)' : 'var(--bg-hover)',
                                            color: alert.status === 'resolved' ? '#008F77' : 'var(--text-muted)'
                                        }}>
                                            {alert.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {alert.status !== 'resolved' && (
                                            <button 
                                                onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(alert.alertId, 'resolved');
                                                        }}
                                                style={{
                                                    background: 'var(--bg-hover)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                <CheckCircle size={14} style={{ color: '#008F77' }}/> Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
