async function checkApi() {
  try {
    const healthRes = await fetch('http://localhost:5000/api/v1/health');
    console.log('Health Check Status:', healthRes.status);
    const healthData = await healthRes.json();
    console.log('Health Check Data:', healthData);
  } catch (err) {
    console.error('Health Check Failed:', err.message);
  }

  try {
    const res = await fetch('http://localhost:5000/api/v1/properties');
    console.log('Properties Status:', res.status);
    const data = await res.json();
    console.log('Data count:', data.data ? data.data.length : 'none');
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Properties API Failed:', err.message);
  }
}

checkApi();
