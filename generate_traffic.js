const API_KEY = "apim_a98d38ef173eef2a804e77d74971df54b743b65e7b4e8325";
const INGEST_URL = "http://localhost:5000/api/hit";

const paths = [
  "/api/v1/users",
  "/api/v1/products",
  "/api/v1/orders",
  "/auth/login",
  "/api/v1/search",
  "/api/v1/analytics"
];
const methods = ["GET", "POST", "PUT", "DELETE"];
const statuses = [200, 200, 200, 201, 201, 400, 401, 403, 404, 500, 503];

async function sendHit() {
  const hit = {
    serviceName: "owlpi-local-gen",
    method: methods[Math.floor(Math.random() * methods.length)],
    endpoint: paths[Math.floor(Math.random() * paths.length)],
    statusCode: statuses[Math.floor(Math.random() * statuses.length)],
    latencyMs: Math.floor(Math.random() * 800) + 20,
    ip: "127.0.0.1",
    userAgent: "Owlpi Local Traffic Gen/2.0",
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
    
    if (res.ok) {
      console.log(`[${hit.statusCode}] ${hit.method} ${hit.endpoint} - Accepted`);
    } else {
      console.error(`Error: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("Connection failed. Is the server running on port 5000?");
  }
}

console.log("🚀 Starting Local Traffic Generation...");
setInterval(sendHit, 1500); // Send a hit every 1.5 seconds
