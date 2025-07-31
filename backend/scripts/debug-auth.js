const axios = require('axios');

async function testAuth() {
    console.log('🔐 Testing Authentication Endpoints');
    console.log('=====================================');

    const BASE_URL = 'http://localhost:3001/api/v1';

    // Test registration
    console.log('\n📝 Testing Registration...');
    const testUser = {
        email: 'debug@fintar.id',
        password: 'DebugPassword123'
    };

    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, testUser, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Registration successful!');
        console.log('   Status:', response.status);
        console.log('   Data:', JSON.stringify(response.data, null, 2));
        
        return response.data.access_token;
        
    } catch (error) {
        console.log('❌ Registration failed:');
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Headers:', error.response.headers);
            console.log('   Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('   No response received');
            console.log('   Request config:', error.config);
        } else {
            console.log('   Error:', error.message);
        }
        
        // Try login instead
        console.log('\n🔑 Trying login with existing user...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Login successful!');
            console.log('   Status:', loginResponse.status);
            console.log('   Data:', JSON.stringify(loginResponse.data, null, 2));
            
            return loginResponse.data.access_token;
            
        } catch (loginError) {
            console.log('❌ Login also failed:');
            if (loginError.response) {
                console.log('   Status:', loginError.response.status);
                console.log('   Data:', JSON.stringify(loginError.response.data, null, 2));
            } else {
                console.log('   Error:', loginError.message);
            }
            return null;
        }
    }
}

testAuth().then(token => {
    if (token) {
        console.log('\n🎉 Authentication successful! Token available for AI testing.');
        console.log('Token preview:', token.substring(0, 30) + '...');
    } else {
        console.log('\n❌ Authentication failed. Cannot proceed with AI testing.');
    }
});
