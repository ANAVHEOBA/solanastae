const io = require('socket.io-client');

// Replace with your server URL
const SERVER_URL = 'http://localhost:5000';

// Test account address to monitor
const TEST_ACCOUNT = '2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2';

// Connect to all channels
const watchlistSocket = io(`${SERVER_URL}/watchlist-activity`);
const dexSocket = io(`${SERVER_URL}/dex-activity`);
const transactionsSocket = io(`${SERVER_URL}/transactions`);
const accountSocket = io(`${SERVER_URL}/whale-monitor/account`);

// Watchlist Activity Channel
watchlistSocket.on('connect', () => {
    console.log('Connected to Watchlist Activity channel');
});

watchlistSocket.on('new_activity', (data) => {
    console.log('\n=== New Watchlist Activity ===');
    console.log('Watchlist Item:', data.watchlistItem);
    console.log('Transaction:', data.transaction);
    console.log('Activity Type:', data.activityType);
});

// DEX Activity Channel
dexSocket.on('connect', () => {
    console.log('Connected to DEX Activity channel');
});

dexSocket.on('new-dex-activity', (transactions) => {
    console.log('\n=== New DEX Activity ===');
    transactions.forEach(tx => {
        console.log('Transaction Hash:', tx.tx_hash);
        console.log('Signer:', tx.signer);
        console.log('Program IDs:', tx.program_ids);
        console.log('Fee:', tx.fee);
        console.log('Block Time:', tx.block_time);
        console.log('Status:', tx.status);
        console.log('Type:', tx.type);
        console.log('Is Large:', tx.is_large);
        console.log('-------------------');
    });
});

// Transactions Channel
transactionsSocket.on('connect', () => {
    console.log('Connected to Transactions channel');
});

transactionsSocket.on('large-transactions', (transactions) => {
    console.log('\n=== Large Transactions ===');
    transactions.forEach(tx => {
        console.log('Transaction Hash:', tx.tx_hash);
        console.log('Signer:', tx.signer);
        console.log('Amount:', tx.amount);
        console.log('Block Time:', tx.block_time);
        console.log('Status:', tx.status);
        console.log('Type:', tx.type);
        console.log('-------------------');
    });
});

// Account Monitoring Channel
accountSocket.on('connect', () => {
    console.log('Connected to Account Monitoring channel');
    // Subscribe to test account
    accountSocket.emit('subscribe', TEST_ACCOUNT);
});

accountSocket.on('account-data', (data) => {
    console.log('\n=== Initial Account Data ===');
    console.log('Account Details:', data.details);
    console.log('Portfolio:', data.portfolio);
    console.log('Token Accounts:', data.tokenAccounts);
    console.log('Stake Accounts:', data.stakeAccounts);
});

accountSocket.on('account-update', (update) => {
    console.log('\n=== Account Update ===');
    console.log('Changes:', update.changes);
    console.log('New Data:', update.data);
});

accountSocket.on('large-transaction', (data) => {
    console.log('\n=== Large Transaction Alert ===');
    console.log('Address:', data.address);
    console.log('Transactions:', data.transactions);
});

// Error handling
[watchlistSocket, dexSocket, transactionsSocket, accountSocket].forEach(socket => {
    socket.on('error', (error) => {
        console.error('Socket Error:', error);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

// Keep the script running
console.log('WebSocket test script running. Press Ctrl+C to exit.');