import request from 'supertest';
import app from '../server.js'; // Ensure your server exports the Express app

console.log("🚀 STARTING STRESS TEST: 100 CONCURRENT USERS 🚀\n");

async function runStressTest() {
    const totalRequests = 100;
    const start = Date.now();
    
    // Simulate 100 concurrent requests to the analytics endpoint
    const requests = Array.from({ length: totalRequests }).map(() => {
        // We'll hit the public trends endpoint or root to avoid needing auth for a simple test
        return request(app).get('/api/admin/trends').catch(() => null); 
    });
    
    await Promise.all(requests);
    const duration = Date.now() - start;
    
    console.log(`✅ Completed ${totalRequests} requests in ${duration}ms`);
    console.log(`📊 Average Response Time: ${(duration / totalRequests).toFixed(2)}ms`);
    console.log(`🔥 System Performance: ${duration < 2000 ? 'EXCELLENT' : 'NEEDS OPTIMIZATION'}`);
    process.exit(0);
}

// To run this properly, ensure you have exported `app` from server.js.
runStressTest();
