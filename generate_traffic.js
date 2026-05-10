const API_KEY = 'apim_bb8a4759ddbcaf6826d61d138be1a1584bcf6167';
const INGEST_URL = 'https://owlpi-production.up.railway.app/api/hit';

const paths = ['/api/v1/users', '/api/v1/products', '/api/v1/orders', '/auth/login'];
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const statuses = [200, 200, 201, 400, 404, 500];

async function sendHit() {
    const hit = {
        serviceName: 'owlpi-traffic-gen',
        method: methods[Math.floor(Math.random() * methods.length)],
        endpoint: paths[Math.floor(Math.random() * paths.length)],
        statusCode: statuses[Math.floor(Math.random() * statuses.length)],
        latencyMs: Math.floor(Math.random() * 500) + 50,
        ip: '1.2.3.4',
        userAgent: 'Owlpi Traffic Generator/1.0'
    };

    try {
        const res = await fetch(INGEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(hit)
        });
        console.log(`[${hit.statusCode}] ${hit.method} ${hit.endpoint} - ${res.statusText}`);
    } catch (err) {
        console.error('Failed to send hit:', err.message);
    }
}

// Send 50 hits
console.log('🚀 Starting traffic generation to Railway...');
for (let i = 0; i < 50; i++) {
    setTimeout(sendHit, i * 100);
}
