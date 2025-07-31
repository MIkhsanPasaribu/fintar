const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

console.log('🚀 Testing Fintar AI Endpoints');
console.log('================================');

async function testEndpoints() {
    try {
        // Test health endpoint first
        console.log('\n📊 Testing Health Endpoint...');
        try {
            const healthResponse = await axios.get(`${BASE_URL}/health`);
            console.log('✅ Health check:', healthResponse.status);
        } catch (error) {
            console.log('❌ Health check failed:', error.message);
        }

        // Test financial AI insights
        console.log('\n📊 Testing Financial AI Insights...');
        try {
            const insightsResponse = await axios.get(`${BASE_URL}/financial/ai-insights`);
            console.log('✅ Financial insights:', insightsResponse.status);
            console.log('   Response:', insightsResponse.data);
        } catch (error) {
            console.log('❌ Financial insights failed:', error.response?.status, error.response?.data || error.message);
        }

        // Test financial AI plan
        console.log('\n📋 Testing Financial AI Plan...');
        try {
            const planResponse = await axios.post(`${BASE_URL}/financial/ai-plan`, {
                duration: "1_year",
                goals: ["saving", "investment"]
            });
            console.log('✅ Financial plan:', planResponse.status);
            console.log('   Response:', planResponse.data);
        } catch (error) {
            console.log('❌ Financial plan failed:', error.response?.status, error.response?.data || error.message);
        }

        // Test budget recommendations
        console.log('\n💰 Testing Budget Recommendations...');
        try {
            const budgetResponse = await axios.get(`${BASE_URL}/financial/budget/ai-recommendations`);
            console.log('✅ Budget recommendations:', budgetResponse.status);
            console.log('   Response:', budgetResponse.data);
        } catch (error) {
            console.log('❌ Budget recommendations failed:', error.response?.status, error.response?.data || error.message);
        }

        // Test investment recommendations
        console.log('\n📈 Testing Investment Recommendations...');
        try {
            const investmentResponse = await axios.get(`${BASE_URL}/financial/investment/recommendations`);
            console.log('✅ Investment recommendations:', investmentResponse.status);
            console.log('   Response:', investmentResponse.data);
        } catch (error) {
            console.log('❌ Investment recommendations failed:', error.response?.status, error.response?.data || error.message);
        }

        // Test chat session creation
        console.log('\n💬 Testing Chat Session Creation...');
        try {
            const chatResponse = await axios.post(`${BASE_URL}/chat/sessions`, {
                title: "Test Session",
                type: "financial_planning",
                metadata: { test: true }
            });
            console.log('✅ Chat session created:', chatResponse.status);
            console.log('   Session ID:', chatResponse.data?.id);
            
            // Test sending message to session
            if (chatResponse.data?.id) {
                console.log('\n📤 Testing Chat Message...');
                try {
                    const messageResponse = await axios.post(`${BASE_URL}/chat/sessions/${chatResponse.data.id}/messages`, {
                        content: "Hello, can you help me with my finances?"
                    });
                    console.log('✅ Chat message sent:', messageResponse.status);
                    console.log('   Response:', messageResponse.data);
                } catch (error) {
                    console.log('❌ Chat message failed:', error.response?.status, error.response?.data || error.message);
                }
            }
        } catch (error) {
            console.log('❌ Chat session creation failed:', error.response?.status, error.response?.data || error.message);
        }

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

// Wait a bit for servers to start
setTimeout(testEndpoints, 3000);
