import { useState, useEffect } from 'react';

export function useEventStream(url) {
    const [events, setEvents] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Since EventSource doesn't support custom headers easily, 
        // we can pass the token in the URL or rely on cookies.
        // For this demo, let's append it to the URL query string
        // Make sure backend accepts token from query string if needed,
        // or for simplicity, we can fetch using a custom SSE implementation,
        // but standard EventSource is easier. 
        // We'll append ?token=...
        
        const eventSource = new EventSource(`${url}?token=${token}`);

        eventSource.onopen = () => {
            setConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEvents(prev => {
                const newEvents = Array.isArray(data) ? data : [data];
                // Combine and remove duplicates based on id
                const combined = [...newEvents, ...prev];
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                return unique.sort((a, b) => b.id - a.id); // newest first
            });
        };

        eventSource.onerror = (err) => {
            setConnected(false);
            setError(err);
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    return { events, connected, error };
}
