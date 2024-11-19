const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'start') {
            // Broadcast start time to all connected clients
            const payload = JSON.stringify({ type: 'start', startTime: data.startTime });
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
        }
    });
});

console.log('WebSocket server running on ws://192.168.29.111:8080');
