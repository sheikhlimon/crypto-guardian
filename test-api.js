// Simple API test file
const testAPI = async () => {
  try {
    // Test health
    console.log('Testing health endpoint...');
    const healthRes = await fetch('http://localhost:3001/health');
    console.log('Health status:', healthRes.status);
    const healthData = await healthRes.json();
    console.log('Health data:', healthData);

    // Test address check with valid Ethereum address (42 chars including 0x)
    console.log('\nTesting address check...');
    const addressRes = await fetch('http://localhost:3001/api/check-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8bc'
      })
    });
    
    console.log('Address check status:', addressRes.status);
    const addressData = await addressRes.json();
    console.log('Address data:', addressData);
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
};

testAPI();
