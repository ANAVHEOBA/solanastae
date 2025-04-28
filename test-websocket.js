const io = require('socket.io-client');

// Connect to DEX Activity channel
const dexSocket = io('http://localhost:5000/dex-activity', {
    transports: ['websocket']
});

// Connect to Transactions channel
const txSocket = io('http://localhost:5000/transactions', {
    transports: ['websocket']
});

// DEX Activity Channel Events
dexSocket.on('connect', () => {
    console.log('Connected to DEX Activity channel');
});

dexSocket.on('new-dex-activity', (transactions) => {
    console.log('\n=== New DEX Activity ===');
    transactions.forEach(tx => {
        console.log('Transaction Hash:', tx.tx_hash);
        console.log('Signer:', tx.signer);
        console.log('Slot:', tx.slot);
        console.log('Status:', tx.status);
        console.log('Block Time:', tx.block_time);
        console.log('Time:', tx.time);
        console.log('Program IDs:', tx.program_ids);
        console.log('Parsed Instructions:', JSON.stringify(tx.parsed_instructions, null, 2));
        console.log('Fee:', tx.fee);
        console.log('Timestamp:', tx.timestamp);
        console.log('-------------------');
    });
});

dexSocket.on('disconnect', () => {
    console.log('Disconnected from DEX Activity channel');
});

// Transactions Channel Events
txSocket.on('connect', () => {
    console.log('Connected to Transactions channel');
});

txSocket.on('large-transactions', (transactions) => {
    console.log('\n=== Large Transactions ===');
    transactions.forEach(tx => {
        console.log('Transaction Hash:', tx.tx_hash);
        console.log('Signer:', tx.signer);
        console.log('Slot:', tx.slot);
        console.log('Status:', tx.status);
        console.log('Block Time:', tx.block_time);
        console.log('Time:', tx.time);
        console.log('Program IDs:', tx.program_ids);
        console.log('Parsed Instructions:', JSON.stringify(tx.parsed_instructions, null, 2));
        console.log('Fee:', tx.fee);
        console.log('Timestamp:', tx.timestamp);
        console.log('-------------------');
    });
});

txSocket.on('disconnect', () => {
    console.log('Disconnected from Transactions channel');
});

// Handle errors
dexSocket.on('error', (error) => {
    console.error('DEX Activity channel error:', error);
});

txSocket.on('error', (error) => {
    console.error('Transactions channel error:', error);
});

// Keep the script running
process.on('SIGINT', () => {
    console.log('Closing connections...');
    dexSocket.close();
    txSocket.close();
    process.exit();
});