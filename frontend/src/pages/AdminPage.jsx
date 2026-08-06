import { useState, useEffect } from 'react';
import { fetchVerifications, fetchTrends } from '../api/apiClient';
import StatsChart from '../components/StatsChart';
import VerificationTable from '../components/VerificationTable';
import { Activity, RefreshCw, Download } from 'lucide-react';

import AnalyticsKPICards from '../components/AnalyticsKPICards';
import InstitutionHeatmap from '../components/InstitutionHeatmap';
import FraudTrendChart from '../components/FraudTrendChart';
import FraudScoreDistribution from '../components/FraudScoreDistribution';
import SuspiciousActivityTable from '../components/SuspiciousActivityTable';
import FraudMap from '../components/FraudMap';
import InstitutionLeaderboard from '../components/InstitutionLeaderboard';

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [alerts, setAlerts] = useState([]);
    const [chain, setChain] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);
    const [certData, setCertData] = useState({ certId: '', studentName: '', course: '', institution: '', year: '', marks: '' });
    const [mining, setMining] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [logsData, trendsData] = await Promise.all([
                    fetchVerifications(),
                    fetchTrends()
                ]);
                setLogs(logsData);
                setTrends(trendsData);
            } catch (error) {
                console.error('Failed to load admin data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fetchExtraData = async () => {
        if (activeTab === 'alerts') {
            import('../api/apiClient').then(({ getAlerts }) => getAlerts().then(setAlerts).catch(console.error));
        } else if (activeTab === 'blockchain') {
            import('../api/apiClient').then(({ getBlockchain }) => getBlockchain().then(setChain).catch(console.error));
        } else if (activeTab === 'analytics') {
            import('../api/apiClient').then(({ getAnalytics }) => getAnalytics().then(setAnalyticsData).catch(console.error));
        }
    };

    useEffect(() => {
        fetchExtraData();
    }, [activeTab]);

    // Live events subscription
    useEffect(() => {
        if (activeTab !== 'live') return;
        const token = localStorage.getItem('token');
        const es = new EventSource(`http://localhost:5000/api/events/stream?token=${token}`);
        es.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setLiveEvents(prev => {
                const arr = Array.isArray(data) ? data : [data];
                return [...arr, ...prev].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 50);
            });
        };
        return () => es.close();
    }, [activeTab]);

    const handleReset = async () => {
        try {
            await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/reset` : 'http://localhost:5000/api/reset', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            window.location.reload();
        } catch (err) {
            console.error('Failed to reset', err);
        }
    };

    const handleResolve = async (id) => {
        import('../api/apiClient').then(({ resolveAlert }) => resolveAlert(id).then(fetchExtraData));
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        setMining(true);
        import('../api/apiClient').then(({ issueCertificateOnChain }) => {
            issueCertificateOnChain(certData).then(() => {
                setMining(false);
                setCertData({ certId: '', studentName: '', course: '', institution: '', year: '', marks: '' });
                fetchExtraData();
            });
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'analytics', label: '📈 Analytics' },
        { id: 'logs', label: '📋 Verification Logs' },
        { id: 'blockchain', label: '⛓️ Blockchain' },
        { id: 'live', label: '📡 Live Feed' },
        { id: 'alerts', label: '🔔 Alerts' },
        { id: 'import', label: '📁 Bulk Import' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg cursor-pointer" onClick={(e) => { 
                        if (e.detail === 3) {
                            if (window.confirm("⚠️ EMERGENCY KILLSWITCH TRIGGERED ⚠️\n\nThis will completely wipe and reseed the database. Are you absolutely sure you want to proceed?")) {
                                handleReset();
                            }
                        } 
                    }} title="Triple-click to reset system">
                        <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                </div>
            </div>

            <div role="tablist" aria-label="Admin Dashboard Tabs" className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Fraud Intelligence & Analytics</h2>
                        <div className="flex gap-2">
                            <button aria-label="Refresh Analytics Data" onClick={fetchExtraData} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm text-sm">
                                <RefreshCw className="w-4 h-4 text-slate-500" aria-hidden="true" /> Refresh
                            </button>
                            <button aria-label="Export Analytics Report" onClick={async () => {
                                try {
                                    const { exportData } = await import('../api/apiClient');
                                    const data = await exportData();
                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'certificates_export.json';
                                    a.click();
                                } catch (err) {
                                    alert('Export failed');
                                }
                            }} className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm text-sm font-medium">
                                <Download className="w-4 h-4" aria-hidden="true" /> Export Report
                            </button>
                        </div>
                    </div>
                    
                    <AnalyticsKPICards data={analyticsData} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">30-Day Fraud Trends</h3>
                            <FraudTrendChart trends={analyticsData?.dailyTrends} />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Global Risk Score</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Aggregated risk index based on recent forgery volume and severity.</p>
                            </div>
                            <FraudScoreDistribution score={analyticsData?.fraudScore || 0} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Fraud Heatmap by Institution</h3>
                            <InstitutionHeatmap data={analyticsData?.topInstitutions} />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Suspicious Activity</h3>
                            <SuspiciousActivityTable activities={analyticsData?.recentVerifications} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Geographic Fraud Distribution</h3>
                        <p className="text-sm text-slate-500 mb-4">Regional simulation based on institution location.</p>
                        <FraudMap data={logs} />
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Institution Scoreboard</h3>
                        <p className="text-sm text-slate-500 mb-4">Top authentic vs top targeted institutions.</p>
                        <InstitutionLeaderboard data={analyticsData?.leaderboard} />
                    </div>
                </div>
            )}

            {activeTab === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Last 24 Hours</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{logs.length} Checks</p></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Flagged/Tampered</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{logs.filter(l => l.verdict !== 'VERIFIED').length}</p></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Verified Authentic</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{logs.filter(l => l.verdict === 'VERIFIED').length}</p></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">7-Day Trends</h2>
                        <StatsChart trends={trends} />
                    </div>
                </>
            )}

            {activeTab === 'logs' && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Verification Logs</h2>
                    <VerificationTable logs={logs} />
                </div>
            )}

            {activeTab === 'blockchain' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold mb-4">Issue New Certificate (On-Chain)</h2>
                        <form onSubmit={handleIssue} className="space-y-4">
                            <input aria-label="Certificate ID" placeholder="Cert ID (e.g. C101)" required className="w-full p-2 border rounded dark:bg-slate-700" value={certData.certId} onChange={e=>setCertData({...certData, certId: e.target.value})} />
                            <input aria-label="Student Name" placeholder="Student Name" required className="w-full p-2 border rounded dark:bg-slate-700" value={certData.studentName} onChange={e=>setCertData({...certData, studentName: e.target.value})} />
                            <button type="submit" disabled={mining} aria-label={mining ? "Mining block" : "Mint Certificate"} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                                {mining ? '⛏️ Mining Block...' : 'Mint Certificate'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl text-green-400 font-mono text-xs overflow-y-auto max-h-96">
                        <h2 className="text-lg font-bold text-white mb-4">Blockchain Ledger</h2>
                        {chain.map(block => (
                            <div key={block.index} className="mb-4 p-3 border border-green-800 rounded bg-black/50">
                                <p>Block #{block.index}</p>
                                <p>Hash: {block.hash}</p>
                                <p>Prev: {block.previousHash}</p>
                                <p>Data: {block.certId} | {block.studentName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[400px]">
                    <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div> Live Verification Feed
                    </h2>
                    <div className="space-y-3">
                        {liveEvents.map(ev => (
                            <div key={ev.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 animate-in slide-in-from-left-4 fade-in">
                                <span className="text-slate-500">[{new Date(ev.timestamp).toLocaleTimeString()}]</span> 
                                <span className="mx-2 font-bold text-white">{ev.certId}</span> 
                                was checked. Result: 
                                <span className={`ml-2 font-bold ${ev.verdict==='VERIFIED' ? 'text-emerald-400' : 'text-red-400'}`}>{ev.verdict}</span>
                            </div>
                        ))}
                        {liveEvents.length === 0 && <p className="text-slate-500 italic">Waiting for events...</p>}
                    </div>
                </div>
            )}

            {activeTab === 'alerts' && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-6 text-red-600">Fraud Detection Alerts</h2>
                    <div className="space-y-4">
                        {alerts.length === 0 && <p className="text-slate-500">No alerts triggered.</p>}
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-4 rounded-xl border flex justify-between items-center ${alert.resolved ? 'bg-slate-50 opacity-50 dark:bg-slate-900' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
                                <div>
                                    <h4 className="font-bold text-red-700 dark:text-red-400">{alert.message}</h4>
                                    <p className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                </div>
                                {!alert.resolved && (
                                    <button onClick={() => handleResolve(alert.id)} className="px-4 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 text-sm font-medium">
                                        Resolve
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'import' && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-4">Bulk Import Certificates (CSV)</h2>
                    <p className="text-sm text-slate-500 mb-6">Upload a CSV file with headers: <code>cert_id, student_name, institution, course, year, marks, issue_date</code>.</p>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <input type="file" aria-label="Upload CSV file for bulk import" accept=".csv" onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                                const token = localStorage.getItem('token');
                                const url = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin/bulk-upload` : 'http://localhost:5000/api/admin/bulk-upload';
                                const res = await fetch(url, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` },
                                    body: formData
                                });
                                const data = await res.json();
                                alert(data.message || 'Upload complete');
                                e.target.value = null;
                            } catch (err) {
                                alert('Upload failed');
                            }
                        }} className="block w-full mx-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>
            )}
        </div>
    );
}
