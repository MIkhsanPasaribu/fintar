const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

console.log('🚀 Testing Fintar AI Endpoints with Authentication');
console.log('=================================================');

async function testWithAuth() {
    let authToken = null;
    
    try {
        // Step 1: Create a test user and login
        console.log('\n🔐 Testing Authentication...');
        
        const testUser = {
            email: 'test@fintar.ai',
            password: 'testpassword123',
            username: 'testuser'
        };

        // Try to register (might fail if user exists, that's ok)
        console.log('📝 Registering test user...');
        try {
            await axios.post(`${BASE_URL}/auth/register`, testUser);
            console.log('✅ User registered successfully');
        } catch (error) {
            console.log('ℹ️ User might already exist, trying login...');
        }

        // Login to get token
        console.log('🔑 Logging in...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            
            authToken = loginResponse.data?.access_token || loginResponse.data?.accessToken || loginResponse.data?.token;
            console.log('✅ Login successful, token received');
            console.log('   Token preview:', authToken ? authToken.substring(0, 20) + '...' : 'No token');
        } catch (error) {
            console.log('❌ Login failed:', error.response?.data || error.message);
            return;
        }

        if (!authToken) {
            console.log('❌ No auth token received');
            return;
        }

        // Configure axios with auth header
        const authHeaders = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        };

        // Step 2: Test all AI endpoints with authentication
        console.log('\n📊 Testing Financial AI Insights...');
        try {
            const insightsResponse = await axios.get(`${BASE_URL}/financial/ai-insights`, { headers: authHeaders });
            console.log('✅ Financial insights:', insightsResponse.status);
            console.log('   Response:', insightsResponse.data);
        } catch (error) {
            console.log('❌ Financial insights failed:', error.response?.status, error.response?.data || error.message);
        }

        console.log('\n📋 Testing Financial AI Plan...');
        try {
            const planResponse = await axios.post(`${BASE_URL}/financial/ai-plan`, {
                duration: "1_year",
                goals: ["saving", "investment"]
            }, { headers: authHeaders });
            console.log('✅ Financial plan:', planResponse.status);
            console.log('   Response:', planResponse.data);
        } catch (error) {
            console.log('❌ Financial plan failed:', error.response?.status, error.response?.data || error.message);
        }

        console.log('\n💰 Testing Budget Recommendations...');
        try {
            const budgetResponse = await axios.get(`${BASE_URL}/financial/budget/ai-recommendations`, { headers: authHeaders });
            console.log('✅ Budget recommendations:', budgetResponse.status);
            console.log('   Response:', budgetResponse.data);
        } catch (error) {
            console.log('❌ Budget recommendations failed:', error.response?.status, error.response?.data || error.message);
        }

        console.log('\n📈 Testing Investment Recommendations...');
        try {
            const investmentResponse = await axios.get(`${BASE_URL}/financial/investment/recommendations`, { headers: authHeaders });
            console.log('✅ Investment recommendations:', investmentResponse.status);
            console.log('   Response:', investmentResponse.data);
        } catch (error) {
            console.log('❌ Investment recommendations failed:', error.response?.status, error.response?.data || error.message);
        }

        console.log('\n💬 Testing Chat Session Creation...');
        try {
            const chatResponse = await axios.post(`${BASE_URL}/chat/sessions`, {
                title: "Test AI Session",
                type: "financial_planning",
                metadata: { test: true }
            }, { headers: authHeaders });
            console.log('✅ Chat session created:', chatResponse.status);
            console.log('   Session ID:', chatResponse.data?.id);
            
            // Test sending message to session
            if (chatResponse.data?.id) {
                console.log('\n📤 Testing Chat Message...');
                try {
                    const messageResponse = await axios.post(`${BASE_URL}/chat/sessions/${chatResponse.data.id}/messages`, {
                        content: "Halo, saya butuh bantuan analisis keuangan."
                    }, { headers: authHeaders });
                    console.log('✅ Chat message sent:', messageResponse.status);
                    console.log('   AI Response:', messageResponse.data);
                } catch (error) {
                    console.log('❌ Chat message failed:', error.response?.status, error.response?.data || error.message);
                }

                // Test getting chat history
                console.log('\n📥 Testing Chat History...');
                try {
                    const historyResponse = await axios.get(`${BASE_URL}/chat/sessions/${chatResponse.data.id}/messages`, { headers: authHeaders });
                    console.log('✅ Chat history retrieved:', historyResponse.status);
                    console.log('   Messages count:', historyResponse.data?.length || 0);
                } catch (error) {
                    console.log('❌ Chat history failed:', error.response?.status, error.response?.data || error.message);
                }
            }
        } catch (error) {
            console.log('❌ Chat session creation failed:', error.response?.status, error.response?.data || error.message);
        }

        console.log('\n🎉 AI Integration Test Complete!');
        console.log('=================================');

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

// Wait a bit for servers to be ready
setTimeout(testWithAuth, 2000);
