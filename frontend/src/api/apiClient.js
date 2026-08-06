import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const uploadCertificate = async (file, useMock = false) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = useMock ? '/upload?mock=true' : '/upload';
    const response = await api.post(url, formData);
    return response.data;
};

export const fetchVerifications = async () => {
    const response = await api.get('/verifications');
    return response.data;
};

export const fetchVerificationById = async (certId) => {
    const response = await api.get(`/verifications/${certId}`);
    return response.data;
};

export const fetchTrends = async () => {
    const response = await api.get('/trends');
    return response.data;
};

// Features
export const generateReport = async (verificationData) => {
    const response = await api.post('/features/generate-report', verificationData, { responseType: 'blob' });
    return response.data;
};

export const generateQRCode = async (certId) => {
    const response = await api.post('/features/generate-qr', { certId });
    return response.data;
};

export const applyWatermark = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/features/apply-watermark', formData, { responseType: 'blob' });
    return response.data;
};

// Blacklist
export const fetchBlacklist = async () => {
    const response = await api.get('/blacklist');
    return response.data;
};

export const addToBlacklist = async (certId, reason) => {
    const response = await api.post('/blacklist', { certId, reason });
    return response.data;
};

export const removeFromBlacklist = async (certId) => {
    const response = await api.delete(`/blacklist/${certId}`);
    return response.data;
};

// Blockchain
export const issueCertificateOnChain = async (data) => {
    const response = await api.post('/blockchain/issue', data);
    return response.data;
};

export const verifyCertificateOnChain = async (certId) => {
    const response = await api.get(`/blockchain/verify/${certId}`);
    return response.data;
};

export const getBlockchain = async () => {
    const response = await api.get('/blockchain/chain');
    return response.data;
};

// Alerts
export const getAlerts = async () => {
    const response = await api.get('/alerts');
    return response.data;
};

export const resolveAlert = async (id) => {
    const response = await api.post(`/alerts/${id}/resolve`);
    return response.data;
};

// Analytics
export const getAnalytics = async () => {
    const response = await api.get('/analytics');
    return response.data;
};

export const exportData = async () => {
    const response = await api.get('/export');
    return response.data;
};

export const getAuditLogs = async () => {
    const response = await api.get('/audit');
    return response.data;
};
