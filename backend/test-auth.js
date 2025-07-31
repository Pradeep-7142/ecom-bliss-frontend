const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Endpoints...\n');

    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.user._id);
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...\n');

    // Test 2: Login with the registered user
    console.log('2. Testing user login...');
    const loginData = {
      email: registerData.email,
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User ID:', loginResponse.data.user._id);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...\n');

    // Test 3: Get user profile
    console.log('3. Testing profile retrieval...');
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User name:', profileResponse.data.user.name);
    console.log('User email:', profileResponse.data.user.email);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);
  }
}

// Run the test
testAuth(); 