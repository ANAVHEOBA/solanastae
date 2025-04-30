const io = require('socket.io-client');
const axios = require('axios');

const SERVER_URL = 'http://localhost:5000';
let AUTH_TOKEN = '';

async function authenticate() {
    try {
        const response = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
            email: "test@example.com",
            password: "Password123!"
        });
        
        if (response.data.success) {
            AUTH_TOKEN = response.data.data.token;
            console.log('Authentication successful');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Authentication failed:', error.message);
        return false;
    }
}

async function getWatchlistAccounts() {
    try {
        const response = await axios.get(`${SERVER_URL}/api/v1/whale-monitor/watchlist`, {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });
        
        if (response.data.success) {
            return response.data.data.items;
        }
        return [];
    } catch (error) {
        console.error('Error fetching watchlist:', error.message);
        return [];
    }
}

async function startMonitoring() {
    // First authenticate
    const isAuthenticated = await authenticate();
    if (!isAuthenticated) {
        console.log('Failed to authenticate. Exiting...');
        return;
    }

    // Get existing watchlist accounts
    const watchlistItems = await getWatchlistAccounts();
    
    if (watchlistItems.length === 0) {
        console.log('No accounts in watchlist');
        return;
    }

    console.log('Found watchlist accounts:', watchlistItems.map(item => ({
        address: item.address,
        label: item.label,
        type: item.type
    })));

    // Connect to WebSocket for each account
    watchlistItems.forEach(item => {
        console.log(`\nSetting up monitoring for ${item.label} (${item.address})`);
        
        const socket = io(SERVER_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token: AUTH_TOKEN
            }
        });

        socket.on('connect', () => {
            console.log(`Connected to monitoring channel for ${item.label} (${item.address})`);
            console.log('Emitting subscribe event...');
            socket.emit('subscribe', item.address);
            
            // Subscribe to large transfers
            console.log('Subscribing to large transfers...');
            socket.emit('subscribe-large-transfers', item.address);
        });

        socket.on('connect_error', (error) => {
            console.error(`Connection error for ${item.label}:`, error.message);
        });

        socket.on('subscription-success', (data) => {
            console.log(`Successfully subscribed to ${item.label}:`, data);
        });

        socket.on('subscription-error', (data) => {
            console.error(`Subscription error for ${item.label}:`, data);
        });

        socket.on('initial-state', (data) => {
            console.log(`\n=== Initial State for ${item.label} ===`);
            console.log('Recent Transactions:', data.transactions.length);
            if (data.transactions.length > 0) {
                console.log('Latest Transaction:', JSON.stringify(data.transactions[0], null, 2));
            }
        });

        socket.on('new-transactions', (data) => {
            console.log(`\n=== New Transactions for ${item.label} ===`);
            console.log('New Transactions:', JSON.stringify(data.transactions, null, 2));
            if (data.defiActivities && data.defiActivities.length > 0) {
                console.log('DeFi Activities:', JSON.stringify(data.defiActivities, null, 2));
            }
        });

        socket.on('error', (error) => {
            console.error(`Error monitoring ${item.label}:`, error);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Disconnected from ${item.label}. Reason:`, reason);
        });

        // Add ping/pong logging
        socket.on('ping', () => {
            console.log(`Ping received for ${item.label}`);
        });

        socket.on('pong', (latency) => {
            console.log(`Pong received for ${item.label}. Latency: ${latency}ms`);
        });

        socket.on('large-transfer', (data) => {
            console.log(`\n🚨 LARGE TRANSFER DETECTED for ${item.label} 🚨`);
            console.log('Transaction Details:');
            console.log(`- Amount: $${data.transaction.usdValue?.toLocaleString()}`);
            console.log(`- From: ${data.transaction.fromAddress}`);
            console.log(`- To: ${data.transaction.toAddress || 'Unknown'}`);
            console.log(`- Token: ${data.transaction.tokenSymbol || 'SOL'}`);
            console.log(`- Hash: ${data.transaction.transactionHash}`);
            console.log(`- Time: ${new Date(data.transaction.timestamp).toLocaleString()}`);
            console.log(`- Status: ${data.transaction.status.toUpperCase()}`);
            console.log('Message:', data.message);
        });

        socket.on('large-transfers-subscription-success', (data) => {
            console.log(`Successfully subscribed to large transfers for ${item.label}`);
        });
    });
}

// Start monitoring
startMonitoring();