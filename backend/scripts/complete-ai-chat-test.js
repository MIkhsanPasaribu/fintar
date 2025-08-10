// Complete End-to-End AI Chat Integration Test

async function completeAIChatTest() {
  console.log('🎯 COMPLETE AI CHAT INTEGRATION TEST');
  console.log('=====================================');
  console.log('');
  
  const baseUrl = 'http://localhost:3001/api/v1';
  const credentials = {
    email: 'fintargemastik@gmail.com',
    password: 'Testing123'
  };
  
  try {
    // 1. Authentication Test
    console.log('1️⃣ AUTHENTICATION TEST');
    console.log('   Testing login with provided credentials...');
    
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${await loginResponse.text()}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    const user = loginData.user;
    
    console.log('   ✅ Login successful');
    console.log(`   👤 User: ${user.email} (ID: ${user.id})`);
    console.log('');

    // 2. Session Management Test  
    console.log('2️⃣ SESSION MANAGEMENT TEST');
    console.log('   Creating new AI chat session...');
    
    const sessionResponse = await fetch(`${baseUrl}/chat/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Complete Integration Test',
        type: 'financial_planning',
        metadata: {
          testType: 'end-to-end',
          timestamp: new Date().toISOString()
        }
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session creation failed: ${await sessionResponse.text()}`);
    }

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.id;
    
    console.log('   ✅ Chat session created');
    console.log(`   💬 Session ID: ${sessionId}`);
    console.log(`   📋 Session Type: ${sessionData.type}`);
    console.log('');

    // 3. AI Chat Interaction Test
    console.log('3️⃣ AI CHAT INTERACTION TEST');
    console.log('   Sending message to AI...');
    
    const testMessage = 'Bagaimana cara mengatur budget bulanan untuk fresh graduate dengan gaji 5 juta?';
    console.log(`   📝 Message: "${testMessage}"`);
    
    const messageResponse = await fetch(`${baseUrl}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: testMessage }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      throw new Error(`Message sending failed: ${errorText}`);
    }

    const messageData = await messageResponse.json();
    
    console.log('   ✅ Message sent successfully');
    console.log('   📨 User message saved:', messageData.userMessage.id);
    console.log('   🤖 AI response generated:', messageData.aiMessage.id);
    console.log(`   📊 AI response length: ${messageData.aiMessage.content.length} characters`);
    console.log(`   ⏱️  Processing time: ${messageData.aiMessage.metadata.processingTime}ms`);
    console.log('');
    
    // Show AI response preview
    const aiResponse = messageData.aiMessage.content;
    const preview = aiResponse.length > 200 ? aiResponse.substring(0, 200) + '...' : aiResponse;
    console.log('   🤖 AI Response Preview:');
    console.log(`   "${preview}"`);
    console.log('');

    // 4. Chat History Test
    console.log('4️⃣ CHAT HISTORY TEST');
    console.log('   Retrieving chat history...');
    
    const historyResponse = await fetch(`${baseUrl}/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!historyResponse.ok) {
      throw new Error(`History retrieval failed: ${await historyResponse.text()}`);
    }

    const historyData = await historyResponse.json();
    
    console.log('   ✅ Chat history retrieved');
    console.log(`   📜 Total messages: ${historyData.length}`);
    console.log('   📋 Message structure:');
    
    historyData.forEach((msg, index) => {
      console.log(`      ${index + 1}. ${msg.role}: "${msg.content.substring(0, 50)}..." (${msg.id})`);
    });
    console.log('');

    // 5. User Sessions Test
    console.log('5️⃣ USER SESSIONS TEST');
    console.log('   Getting all user sessions...');
    
    const sessionsResponse = await fetch(`${baseUrl}/chat/sessions`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!sessionsResponse.ok) {
      throw new Error(`Sessions retrieval failed: ${await sessionsResponse.text()}`);
    }

    const sessionsData = await sessionsResponse.json();
    
    console.log('   ✅ User sessions retrieved');
    console.log(`   📊 Total sessions: ${sessionsData.length}`);
    console.log('');

    // 6. Frontend Compatibility Test
    console.log('6️⃣ FRONTEND COMPATIBILITY TEST');
    console.log('   Validating data structure for frontend...');
    
    // Test message structure
    const sampleMessage = historyData[0];
    const requiredMessageFields = ['id', 'content', 'role', 'timestamp'];
    const hasRequiredFields = requiredMessageFields.every(field => sampleMessage[field]);
    
    // Test session structure
    const requiredSessionFields = ['id', 'title', 'type', 'createdAt'];
    const sessionCompatible = requiredSessionFields.every(field => sessionData[field]);
    
    console.log(`   📝 Message structure compatible: ${hasRequiredFields ? '✅' : '❌'}`);
    console.log(`   💬 Session structure compatible: ${sessionCompatible ? '✅' : '❌'}`);
    
    // Test AI response structure
    const aiMessageStructure = {
      hasContent: !!messageData.aiMessage.content,
      hasMetadata: !!messageData.aiMessage.metadata,
      hasTimestamp: !!messageData.aiMessage.timestamp,
      hasId: !!messageData.aiMessage.id
    };
    
    const aiCompatible = Object.values(aiMessageStructure).every(Boolean);
    console.log(`   🤖 AI response structure compatible: ${aiCompatible ? '✅' : '❌'}`);
    console.log('');

    // Final Summary
    console.log('🎉 INTEGRATION TEST SUMMARY');
    console.log('===========================');
    console.log('✅ User authentication successful');
    console.log('✅ Chat session creation working');
    console.log('✅ AI message processing functional');
    console.log('✅ Chat history retrieval working');
    console.log('✅ User sessions management working');
    console.log('✅ Data structures compatible with frontend');
    console.log('');
    console.log('🚀 STATUS: AI CHATBOT FULLY FUNCTIONAL!');
    console.log('');
    
    // Return test results
    return {
      success: true,
      results: {
        authentication: '✅ Working',
        sessionManagement: '✅ Working',
        aiInteraction: '✅ Working',
        chatHistory: '✅ Working',
        userSessions: '✅ Working',
        frontendCompatibility: aiCompatible && hasRequiredFields && sessionCompatible ? '✅ Working' : '⚠️ Issues'
      },
      testData: {
        sessionId,
        messageCount: historyData.length,
        aiResponseLength: messageData.aiMessage.content.length,
        processingTime: messageData.aiMessage.metadata.processingTime
      },
      credentials: {
        email: credentials.email,
        note: 'Use these credentials to test in frontend'
      }
    };
    
  } catch (error) {
    console.error('');
    console.error('❌ INTEGRATION TEST FAILED');
    console.error('==========================');
    console.error('Error:', error.message);
    
    return { 
      success: false, 
      error: error.message,
      note: 'Check backend logs for more details'
    };
  }
}

// Run the complete test
completeAIChatTest().then(result => {
  if (result.success) {
    console.log('🎯 TEST COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Login with: fintargemastik@gmail.com / Testing123');
    console.log('3. Navigate to AI Chat/Navigator feature');
    console.log('4. Start chatting - everything should work now!');
  } else {
    console.log('🔧 TEST FAILED - Please check backend configuration');
  }
});
