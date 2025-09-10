const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const express = require('express');
const http = require('http');
require('dotenv').config({ path: '.env' });

const PORT = 3001;

// Create an Express app and an HTTP server
const app = express();
app.use(express.json());
const server = http.createServer(app);

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
    // The token is now passed in the headers during the upgrade request
    const token = req.headers['sec-websocket-protocol'];
    if (!token) {
        console.log('[WSS] Connection attempt without token. Closing.');
        ws.close();
        return;
    }

    console.log('[WSS] Verifying token...');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('[WSS] Invalid token:', err.message);
            ws.close();
            return;
        }

        const userId = decoded.userId;
        clients.set(userId, ws);
        console.log(`[WSS] Client connected: ${userId}. Total clients: ${clients.size}`);

        // Handle incoming messages from this client
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                console.log(`[WSS] Received message from ${userId}:`, data);

                const recipientSocket = clients.get(data.recipientId);
                if (recipientSocket && recipientSocket.readyState === 1) { // WebSocket.OPEN
                    
                    let response;
                    if (data.type === 'typing_start') {
                        response = { type: 'user_typing', payload: { conversationId: data.conversationId } };
                    } else if (data.type === 'typing_stop') {
                        response = { type: 'user_stopped_typing', payload: { conversationId: data.conversationId } };
                    } else if (data.type === 'new_message') {
                        response = { type: 'new_message', payload: data.message };
                    }

                    if (response) {
                        console.log(`[WSS] Relaying to ${data.recipientId}:`, response);
                        recipientSocket.send(JSON.stringify(response));
                    }
                }
            } catch (error) {
                console.error(`[WSS] Error processing message from ${userId}:`, error);
            }
        });

        ws.on('close', () => {
            clients.delete(userId);
            console.log(`[WSS] Client disconnected: ${userId}. Total clients: ${clients.size}`);
        });

        ws.on('error', (error) => {
            console.error(`[WSS] Error for client ${userId}:`, error);
        });
    });
});

// HTTP endpoint for the main app to send notifications
app.post('/notify', (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) {
        return res.status(400).json({ error: 'userId and message are required' });
    }

    const client = clients.get(userId);
    console.log(`[WSS] Attempting to send notification to ${userId}`);
    if (client && client.readyState === 1) { // WebSocket.OPEN
        console.log(`[WSS] Client ${userId} found, sending message:`, message);
        client.send(JSON.stringify(message), (error) => {
            if (error) {
                console.error(`[WSS] Failed to send message to ${userId}:`, error);
            }
        });
        res.status(200).json({ success: true, message: 'Notification sent.' });
    } else {
        console.log(`[WSS] Client ${userId} not found or connection not open. State: ${client?.readyState}`);
        res.status(404).json({ success: false, message: 'Client not connected.' });
    }
});

server.listen(PORT, () => {
    console.log(`> WebSocket server ready on http://localhost:${PORT}`);
});
