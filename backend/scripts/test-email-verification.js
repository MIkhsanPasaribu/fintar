const axios = require('axios');

async function testEmailVerificationFlow() {
    console.log('🧪 Testing Email Verification Flow');
    console.log('=======================================');

    const BASE_URL = 'http://localhost:3002/api/v1';
    const testUser = {
        email: 'test-email-verification@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'TestPassword123'
    };

    try {
        // Step 1: Register user (should require email verification)
        console.log('\n📝 Step 1: Testing Registration...');
        
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Registration successful!');
        console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
        
        // Check if requires verification
        if (registerResponse.data.requiresVerification) {
            console.log('✅ Email verification required as expected');
            
            // Step 2: Try to login without verification (should fail)
            console.log('\n🔐 Step 2: Testing Login Before Verification...');
            
            try {
                await axios.post(`${BASE_URL}/auth/login`, {
                    email: testUser.email,
                    password: testUser.password
                });
                console.log('❌ Login should have failed but succeeded');
            } catch (loginError) {
                if (loginError.response && loginError.response.status === 401) {
                    console.log('✅ Login correctly blocked for unverified user');
                    console.log('Message:', loginError.response.data.message);
                } else {
                    console.log('❌ Unexpected login error:', loginError.message);
                }
            }
            
            // Step 3: Test resend verification
            console.log('\n📧 Step 3: Testing Resend Verification...');
            
            try {
                const resendResponse = await axios.post(`${BASE_URL}/auth/resend-verification`, {
                    email: testUser.email
                });
                console.log('✅ Resend verification successful');
                console.log('Response:', resendResponse.data.message);
            } catch (resendError) {
                console.log('❌ Resend verification failed:', resendError.response?.data || resendError.message);
            }
            
        } else {
            console.log('⚠️ Registration did not require verification - check implementation');
        }
        
    } catch (error) {
        console.log('❌ Registration failed:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('- Registration with email verification: Check above results');
    console.log('- Login blocking for unverified users: Check above results');
    console.log('- Resend verification functionality: Check above results');
    console.log('\n💡 Note: Check your SMTP configuration in .env file for actual email sending');
}

testEmailVerificationFlow();
