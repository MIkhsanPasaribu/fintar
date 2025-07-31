const axios = require('axios');

async function checkServer() {
    console.log('🔍 Checking Server Status');
    console.log('=========================');

    const BASE_URL = 'http://localhost:3001';
    
    // Test 1: Direct backend health
    console.log('\n1️⃣ Testing direct backend health...');
    try {
        const health = await axios.get(`${BASE_URL}/api/v1/health`, { timeout: 5000 });
        console.log('✅ Health endpoint works:', health.status);
        console.log('   Response:', health.data);
    } catch (error) {
        console.log('❌ Health endpoint failed:', error.message);
        return;
    }

    // Test 2: Check if auth endpoint exists
    console.log('\n2️⃣ Testing auth endpoint existence...');
    try {
        // Try a GET to auth (should get 404 or method not allowed, not connection error)
        await axios.get(`${BASE_URL}/api/v1/auth/register`);
    } catch (error) {
        if (error.response) {
            console.log('✅ Auth endpoint exists (status:', error.response.status, ')');
        } else {
            console.log('❌ Auth endpoint not reachable:', error.message);
            return;
        }
    }

    // Test 3: Simple POST to register
    console.log('\n3️⃣ Testing simple registration...');
    const simpleUser = {
        email: 'simple@test.com',
        password: '123456'
    };

    try {
        const registerResponse = await axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/auth/register`,
            data: simpleUser,
            timeout: 5000,
            validateStatus: () => true // Accept any status
        });
        
        console.log('📊 Register response:');
        console.log('   Status:', registerResponse.status);
        console.log('   Data:', registerResponse.data);
        
        if (registerResponse.status === 201 || registerResponse.status === 200) {
            console.log('✅ Registration successful!');
            return registerResponse.data.access_token;
        } else if (registerResponse.status === 409) {
            console.log('ℹ️ User already exists, trying login...');
            
            const loginResponse = await axios({
                method: 'post',
                url: `${BASE_URL}/api/v1/auth/login`,
                data: simpleUser,
                timeout: 5000,
                validateStatus: () => true
            });
            
            console.log('📊 Login response:');
            console.log('   Status:', loginResponse.status);
            console.log('   Data:', loginResponse.data);
            
            if (loginResponse.status === 200 || loginResponse.status === 201) {
                console.log('✅ Login successful!');
                return loginResponse.data.access_token;
            }
        }
        
    } catch (error) {
        console.log('❌ Auth request failed:', error.message);
    }
    
    return null;
}

checkServer().then(token => {
    if (token) {
        console.log('\n🎉 Got authentication token!');
        console.log('Now testing AI endpoints...');
        
        // Quick AI test
        testAI(token);
    } else {
        console.log('\n❌ Could not get authentication token');
    }
});

async function testAI(token) {
    const headers = { 'Authorization': `Bearer ${token}` };
    const BASE_URL = 'http://localhost:3001/api/v1';
    
    console.log('\n🤖 Testing AI Endpoints...');
    
    try {
        const insights = await axios.get(`${BASE_URL}/financial/ai-insights`, { headers, timeout: 5000 });
        console.log('✅ AI Insights:', insights.status, insights.data);
    } catch (error) {
        console.log('❌ AI Insights failed:', error.response?.status, error.response?.data || error.message);
    }
}
