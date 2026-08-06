import { EventEmitter } from 'events';

class EventService extends EventEmitter {
    constructor() {
        super();
        this.recentEvents = [];
    }

    emitVerificationEvent(verificationResult) {
        const event = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            certId: verificationResult.extractedData?.certId || 'UNKNOWN',
            verdict: verificationResult.verdict
        };
        this.recentEvents.push(event);
        if (this.recentEvents.length > 50) this.recentEvents.shift(); // keep last 50
        this.emit('verification', event);
    }
}

export const eventService = new EventService();
