const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

async function quickTest() {
    console.log('🔧 Quick AI Navigator Test');
    console.log('===========================');

    // Test 1: Register a test user
    console.log('\n1️⃣ Testing User Registration...');
    const testUser = {
        email: 'aitest@fintar.id',
        password: 'TestPassword123'
    };

    try {
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('✅ Registration successful:', registerResponse.status);
        console.log('   Token received:', !!registerResponse.data.access_token);
        
        // Use the token from registration
        const token = registerResponse.data.access_token;
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Test 2: Test AI Financial Insights
        console.log('\n2️⃣ Testing AI Financial Insights...');
        try {
            const insights = await axios.get(`${BASE_URL}/financial/ai-insights`, { headers });
            console.log('✅ Financial insights:', insights.status);
            console.log('   Data:', insights.data);
        } catch (error) {
            console.log('❌ Financial insights error:', error.response?.data?.message || error.message);
        }

        // Test 3: Test AI Financial Plan
        console.log('\n3️⃣ Testing AI Financial Plan...');
        try {
            const plan = await axios.post(`${BASE_URL}/financial/ai-plan`, {
                duration: "1_year",
                goals: ["saving"]
            }, { headers });
            console.log('✅ Financial plan:', plan.status);
            console.log('   Data:', plan.data);
        } catch (error) {
            console.log('❌ Financial plan error:', error.response?.data?.message || error.message);
        }

        // Test 4: Test Chat Session
        console.log('\n4️⃣ Testing Chat Session...');
        try {
            const session = await axios.post(`${BASE_URL}/chat/sessions`, {
                title: "AI Test Session",
                type: "financial_planning"
            }, { headers });
            console.log('✅ Chat session created:', session.status);
            console.log('   Session ID:', session.data.id);

            // Send a message
            if (session.data.id) {
                console.log('\n5️⃣ Testing Chat Message...');
                const message = await axios.post(`${BASE_URL}/chat/sessions/${session.data.id}/messages`, {
                    content: "Halo, tolong berikan analisis keuangan saya."
                }, { headers });
                console.log('✅ Message sent:', message.status);
                console.log('   AI Response:', message.data?.aiMessage?.content || message.data?.response || 'No response');
            }
        } catch (error) {
            console.log('❌ Chat error:', error.response?.data?.message || error.message);
        }

    } catch (registerError) {
        // If registration fails, try to login instead
        console.log('ℹ️ Registration failed, trying login...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
            console.log('✅ Login successful:', loginResponse.status);
            
            const token = loginResponse.data.access_token;
            const headers = { 'Authorization': `Bearer ${token}` };
            
            // Quick test with existing user
            console.log('\n🔄 Testing with existing user...');
            const insights = await axios.get(`${BASE_URL}/financial/ai-insights`, { headers });
            console.log('✅ AI endpoint working:', insights.status);
            
        } catch (loginError) {
            console.log('❌ Both register and login failed:');
            console.log('   Register error:', registerError.response?.data?.message || registerError.message);
            console.log('   Login error:', loginError.response?.data?.message || loginError.message);
        }
    }

    console.log('\n🏁 Test Complete');
}

quickTest();
