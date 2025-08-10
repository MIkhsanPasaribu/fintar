// Simple AI Service Test

const axios = require('axios');

async function testAIServiceDirect() {
  console.log('🤖 Testing AI Service Direct...');
  
  const API_BASE_URL = 'http://localhost:3001/api/v1';
  const email = 'fintargemastik@gmail.com';
  const password = 'Testing123';
  
  try {
    // Login
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Login successful');

    // Create session
    const sessionResponse = await axios.post(`${API_BASE_URL}/chat/sessions`, {
      title: 'AI Service Test',
      type: 'financial_planning',
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const sessionId = sessionResponse.data.id;
    console.log('✅ Session created:', sessionId);

    // Send simple message
    console.log('📨 Sending simple message...');
    
    try {
      const messageResponse = await axios.post(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
        content: 'Hello, just a simple test message.'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 60 second timeout for AI processing
      });

      console.log('✅ AI Response received successfully!');
      console.log('Response structure:', Object.keys(messageResponse.data));
      
      if (messageResponse.data.aiMessage) {
        console.log('AI Response preview:', messageResponse.data.aiMessage.content.substring(0, 100) + '...');
      }
      
      return { success: true };
      
    } catch (aiError) {
      console.error('❌ AI Service Error:', aiError.message);
      
      if (aiError.response) {
        console.error('Status:', aiError.response.status);
        console.error('Error data:', aiError.response.data);
      }
      
      // Check if it's a timeout or Gemini quota issue
      if (aiError.code === 'ECONNABORTED') {
        console.log('⏱️  Request timeout - AI service may be processing slowly');
      }
      
      return { success: false, error: aiError.message };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run test
testAIServiceDirect();
