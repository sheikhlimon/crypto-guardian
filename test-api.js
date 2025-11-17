// Test script to check API response structure

async function testAPI() {
  try {
    // Test with a known Ethereum address
    const response = await fetch('http://localhost:3001/api/check-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Known Bitcoin address (Genesis address)
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response structure:');
      console.log(JSON.stringify(data, null, 2));
      
      // Check specific fields
      if (data.data) {
        console.log('\n--- Key Information ---');
        console.log('Balance:', data.data.balance);
        console.log('Total Value (USD):', data.data.total_value);
        console.log('Transaction Count:', data.data.transaction_count);
        console.log('Risk Score:', data.data.risk_score);
      }
    } else {
      console.log('Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('Connection error:', error.message);
    console.log('Backend is not running');
  }
}

testAPI();
