# 🎯 AI CHAT INTEGRATION - TESTING & VERIFICATION

## 🧪 COMPREHENSIVE TEST PLAN

### Test 1: Browser Console Integration Test

```javascript
// Run this in browser console at http://localhost:3000/chat
async function testChatIntegration() {
  console.log("🚀 Starting AI Chat Integration Test...");

  try {
    // Test 1: Session Creation
    console.log("📝 Test 1: Session Creation");
    const response = await fetch("/api/auth/profile", {
      credentials: "include",
    });
    const user = await response.json();
    console.log("User:", user);

    if (!user.id) {
      console.error("❌ User not logged in");
      return;
    }

    // Test 2: Create Chat Session
    console.log("📝 Test 2: Create Chat Session");
    const sessionResponse = await fetch("/api/chat/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId: user.id }),
    });

    const sessionData = await sessionResponse.json();
    console.log("Session created:", sessionData);

    if (!sessionData.id) {
      console.error("❌ Session creation failed");
      return;
    }

    // Test 3: Send Message
    console.log("📝 Test 3: Send Message");
    const messageResponse = await fetch(
      `/api/chat/sessions/${sessionData.id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: "Halo, berikan analisis keuangan singkat untuk saya",
          userId: user.id,
        }),
      }
    );

    const messageData = await messageResponse.json();
    console.log("Message response:", messageData);

    if (messageData.response) {
      console.log("✅ Chat integration working!");
      console.log("🤖 AI Response:", messageData.response);
    } else {
      console.error("❌ Message processing failed");
    }

    // Test 4: Get History
    console.log("📝 Test 4: Get Chat History");
    const historyResponse = await fetch(
      `/api/chat/sessions/${sessionData.id}/messages`,
      {
        credentials: "include",
      }
    );

    const historyData = await historyResponse.json();
    console.log("Chat history:", historyData);

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testChatIntegration();
```

### Test 2: Manual UI Testing Checklist

#### Prerequisites:

- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] User logged in successfully

#### Step-by-step Test:

1. **Navigate to Chat**

   - [ ] Go to http://localhost:3000/chat
   - [ ] Verify no console errors on page load
   - [ ] Check that chat interface loads properly

2. **Session Creation**

   - [ ] Verify session is created automatically
   - [ ] Check network tab for successful session creation
   - [ ] No "Chat session not found" errors

3. **Send Message**

   - [ ] Type message: "Halo, analisis keuangan saya"
   - [ ] Click send or press Enter
   - [ ] Verify message appears in chat
   - [ ] Wait for AI response

4. **Verify Response**

   - [ ] AI response appears within 10 seconds
   - [ ] Response is in Indonesian
   - [ ] No "Failed to process message" errors
   - [ ] Response is relevant to financial analysis

5. **Test Session Persistence**
   - [ ] Refresh the page
   - [ ] Verify chat history loads (if any)
   - [ ] Send another message
   - [ ] Verify it works consistently

#### Error Scenarios to Test:

1. **Network Interruption**

   - [ ] Disconnect internet briefly
   - [ ] Try sending message
   - [ ] Verify proper error message

2. **Server Restart**

   - [ ] Restart backend server
   - [ ] Try sending message
   - [ ] Verify session recreation works

3. **Invalid Session**
   - [ ] Manually corrupt session in browser storage
   - [ ] Try sending message
   - [ ] Verify new session is created

## 🔍 DEBUGGING COMMANDS

### Check Backend Status:

```bash
# From project root
cd backend
npm run start:dev

# Check if server is running
curl http://localhost:3001/health
```

### Check Frontend Status:

```bash
# From project root
cd frontend
npm run dev

# Check if frontend is accessible
curl http://localhost:3000
```

### Check Authentication:

```bash
# Test login endpoint
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check AI Chat Endpoints:

```bash
# Create session (need auth token)
curl -X POST http://localhost:3001/chat/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":"user-id"}'

# Send message
curl -X POST http://localhost:3001/chat/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello","userId":"user-id"}'
```

## 🎯 SUCCESS CRITERIA

### ✅ Chat Should Work If:

1. **Session Creation**: New session created successfully
2. **Message Sending**: Messages sent without "Chat session not found"
3. **AI Response**: Proper AI responses in Indonesian
4. **Error Handling**: Clear error messages when things fail
5. **Persistence**: Chat works after page refresh
6. **Recovery**: Can recover from network/server issues

### ❌ Issues to Watch For:

1. **"Chat session not found"** → Session ID validation issue
2. **"Failed to process message"** → Backend communication issue
3. **Blank responses** → AI service integration issue
4. **Console errors** → JavaScript runtime issues
5. **Infinite loading** → Network or async handling issues

## 🚀 DEPLOYMENT READINESS

When all tests pass:

- [ ] Manual testing successful
- [ ] Console testing successful
- [ ] Error handling verified
- [ ] Session persistence working
- [ ] Ready for production deployment

---

**Next Action**: Run browser console test → Manual UI test → Verify all scenarios
**Expected Result**: Fully functional AI chat without any "session not found" errors
