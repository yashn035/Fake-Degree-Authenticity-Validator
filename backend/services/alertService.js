class AlertService {
    constructor() {
        this.alerts = [];
    }

    sendAlert(alertType, data) {
        const id = Date.now().toString();
        const alert = {
            id,
            type: alertType,
            certId: data.certId,
            message: `Certificate ${data.certId} flagged as ${alertType}`,
            timestamp: new Date().toISOString(),
            resolved: false
        };
        
        this.alerts.push(alert);
        
        // Simulate real-world dispatch
        console.log(`\n🚨 FRAUD ALERT TRIGGERED`);
        console.log(`📧 EMAIL: fraud-team@university.edu - ${alert.message}`);
        console.log(`📱 SMS: +91-9876543210 - Alert for ${alert.certId} (${alertType})\n`);
    }

    getAlerts() {
        return this.alerts;
    }

    resolveAlert(id) {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) {
            alert.resolved = true;
        }
    }
}

export const alertService = new AlertService();
