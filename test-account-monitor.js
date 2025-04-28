const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:5000/whale-monitor/account', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// Example account address to monitor
const accountAddress = '2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2'; // Replace with actual address

// Connection events
socket.on('connect', () => {
    console.log('Connected to account monitoring channel');
    
    // Subscribe to account updates
    socket.emit('subscribe', accountAddress);
});

socket.on('disconnect', () => {
    console.log('Disconnected from account monitoring channel');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

// Account data events
socket.on('account-data', (data) => {
    console.log('Initial account data received:');
    console.log(JSON.stringify(data, null, 2));
});

socket.on('account-update', (update) => {
    console.log('Account update received:');
    console.log('Changes detected:', update.changes.hasChanges);
    
    if (update.changes.balanceChanges.length > 0) {
        console.log('Balance changes:', update.changes.balanceChanges);
    }
    
    if (update.changes.newTransactions.length > 0) {
        console.log('New transactions:', update.changes.newTransactions);
    }
    
    if (update.changes.portfolioChanges.length > 0) {
        console.log('Portfolio changes:', update.changes.portfolioChanges);
    }
    
    if (update.changes.tokenAccountChanges.length > 0) {
        console.log('Token account changes:', update.changes.tokenAccountChanges);
    }
    
    if (update.changes.stakeAccountChanges.length > 0) {
        console.log('Stake account changes:', update.changes.stakeAccountChanges);
    }
    
    if (update.changes.newTransfers.length > 0) {
        console.log('New transfers:', update.changes.newTransfers);
    }
    
    if (update.changes.newDefiActivities.length > 0) {
        console.log('New DeFi activities:', update.changes.newDefiActivities);
    }
});

socket.on('error', (error) => {
    console.error('Error:', error);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Unsubscribing and disconnecting...');
    socket.emit('unsubscribe', accountAddress);
    socket.disconnect();
    process.exit();
}); 