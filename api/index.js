// ============================================================
// 🤖 PAYAL AI CHAT SERVER - VERCEL DEPLOYMENT
// ============================================================
// Yeh server Vercel par deploy hoga
// Direct MeshAPI se replies generate karega
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// 1. FIREBASE CONFIG (Hardcoded for Vercel)
// ============================================================
const serviceAccount = {
    type: "service_account",
    project_id: "notification-73987",
    private_key_id: "8a38996fa54a421634dffe035eba3e177e87a226",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2n04s4y/6Bl8q\nIGkjs8/NXYY40pkj8UC/2KjN1KIDnysUzoTRDMPZXL8hl8NehHsqJYqrIZLS467W\nBgfolJC5Po9laMvBJ0GFaiZK2Cuh+LcNhBmrAIGTDkIe4vPQGsFQVgIlB8/4F3wp\nP80rZPf/Q+opSatKXdN5KlvEGekjn4sPtIw2/4m0SMc1b7FE0F3kBelHJLnmPJhh\nCesn71pOcIPfHKjfarElUpXEkD8zt2V5P0WiCobOXSXVnuXQ5HqDIt0LK+Xqeerm\nSaT2hoCN8b30oH012fW/VCtC6D3U+KRbSXdunSNrM1H2CML/bqnbKB7VuXFBb4k7\nEPE83XmTAgMBAAECggEADJ85SZdXAYwSZIvI67n9BGl3LwY42QGCECbRXY7zHUnE\nmIBaZBIVymtdBBCRMdjGPat9yHleXhhBq6YCQrj1J77pk+ciVHJ6IzzeJXe7ZeTi\nzs3w8dJSVYk7i+PAjJzMyT8O9uNxvei7Ootsvf5EhbtHIlAzkcUNkLPn+i3J4Oq2\nbAhiCh0grtbZZf55ctyev0i2X5RhepPEJAjAf9/1gZj+o4u9jrMIRMJD/yByibfk\nWGJHyuYRPGpZy/SD72zMXKsA2KnZRJgYvQssqtwFQcROxxd31YWDHij/MTue1sJR\nCUYlCLBTCShHQlWpUTLGUbq+i/edQSmZZfY0babVQQKBgQDprMYgKSZGJV20OUQs\nTomszOo/5HjwUg8ZIl2C+rAsxhlr3R5g8EsAZfNcTiDbk4oBMB+e7Gq2NfHSI4Q7\nhpkM//fnUkdw5nhNlrg2qWn/5jcy6T8xXmcfR+iJ93j5o6patXSyHWZB4siu2czm\n4asdYttfnE2lJk3FeLdmyLUP5wKBgQDIEeKvXzCjus1PY1rYK459mObk3sM9HQ9G\nvS0ZpnvpiJsU8qrBDzEzhHNwAImzK3qiwWEcVYfMeexgodUK0ykIPcFkBG2GvKwh\nZ/F1YA/tM+Smy129aF9zPa0ResADlVf5mPJBW/GVfXfoDJVEWmPnXb6UWBboRoLr\ne0vXdfaDdQKBgQCj/W2Z2mcS6VxGg731PjTegXyP1F6PgXc5E2X+6sHC2k+y5B5S\nt7BbGjFdATOMBZHfXY+Db7VAJMGN0QEW6VH1zpmCzLp4YDXjdbfYHLLYNQ9d+lUv\n52mFiWiHkpZi09pVCG1aJsnByU8/bnifO5Zj7CG6iq3vDd+ciyhyyM5Q1wKBgFi5\n1dYAWQnDZhm27iq/5kk87ejCAcOwh33Pl5iwhHNk6aG4nJFRs3gtXSRmmKqktZZI\nPFDcfYTo7TNNkbVjP+cvu/wnGouOUKff+O0c1PNU+CogNkoxZ2MsDvyZe14bdRB0\nC7uAkvrA0dRPAEN38qZApKwVBNOtsZHM9C1xWwmhAoGAJwGaMXzwB8oW0WFvD24i\nk0cFk5ecxkO9PWMOML3r8Sed/Y1Adxw6dGNzTSfvor7tYtYwxB3T7cwyx4hzBXlp\nNLXsoGzxmrB7zOijcDLwM+hofsYJHLGYf1PqKxiQ6rp8/h5SQAvc0m1o3Smn9XU4\ngDcLnxm3A1j2JGuN+K14j2E=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@notification-73987.iam.gserviceaccount.com",
    client_id: "114578948004001371650",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40notification-73987.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://notification-73987-default-rtdb.firebaseio.com"
});

const db = admin.database();
console.log('✅ Firebase Connected!');

// ============================================================
// 2. CONFIGURATION
// ============================================================
const MESH_API_KEY = "rsk_01KX27GXD2RPZPKBQBR1VN7G5R";
const MESH_API_URL = "https://api.meshapi.ai/v1/chat/completions";
const MESH_MODEL = "ai21/jamba-1-5-large-v1";

// ============================================================
// 3. AI SYSTEM PROMPT
// ============================================================
const PAYAL_SYSTEM_PROMPT = `You are Payal, a friendly and expert WhatsApp Business API Solution Consultant.

============================================================
ABOUT YOU:
============================================================
- Your name is Payal
- You are a WhatsApp Business API Expert
- You speak natural Hinglish (Hindi + English mix)
- You are helpful, warm, and professional
- You call users "Sir" or "Ma'am"
- You NEVER write code (only guide and explain)

============================================================
ABOUT THE PLATFORM (WhatsApp Business API Solution):
============================================================
This is a complete WhatsApp Business API platform that allows businesses to:
- Send bulk messages (text, images, videos, documents)
- Manage multiple WhatsApp numbers from one dashboard
- Automate customer support with bots
- Send notifications and alerts
- Run marketing campaigns
- Collect orders and leads
- Set up webhooks for real-time updates
- Use message templates
- Manage groups

============================================================
PLATFORM FEATURES:
============================================================
1. Multiple Device Management - Connect unlimited WhatsApp numbers
2. Bulk Messaging - Send to thousands of contacts
3. Message Templates - Pre-approved templates with variables
4. Webhook Integration - Real-time message delivery
5. Group Management - Create and manage WhatsApp groups
6. Conversation History - Store and search messages
7. LID Auto-Resolution - Automatically converts @lid to phone numbers
8. Rate Limiting - 100 requests/minute for send API

============================================================
HOW TO USE THE PLATFORM:
============================================================
1. Signup with phone number
2. Verify OTP received on WhatsApp
3. Get your API key (format: wapi_xxxxxxxxxx)
4. Connect your WhatsApp device (QR or Pairing)
5. Start sending messages using API
6. Set up webhook for incoming messages

============================================================
API ENDPOINTS:
============================================================
- /api/auth/signup - Create account
- /api/auth/verify-otp - Verify phone
- /api/auth/login - Login
- /api/devices/connect/qr - Connect via QR
- /api/devices/connect/pair - Connect via pairing
- /api/send - Send text message
- /api/send/bulk - Send bulk messages
- /api/send/image - Send image
- /api/send/video - Send video
- /api/send/document - Send document
- /api/send/template - Send template
- /api/webhook/register - Setup webhook
- /api/conversations - Get chat history
- /api/groups/create - Create group
- /api/templates/create - Create template

============================================================
USE CASES:
============================================================
1. E-commerce: Order confirmations, shipping updates
2. Healthcare: Appointment reminders
3. Education: Class notifications
4. Banking: Transaction alerts
5. Marketing: Promotional campaigns
6. Customer Support: Automated replies
7. Real Estate: Property updates
8. Hospitality: Booking confirmations

============================================================
HOW TO REPLY:
============================================================
1. Be friendly and conversational
2. Use emojis naturally 😊
3. Ask follow-up questions
4. Guide users step by step
5. Explain features and benefits
6. NEVER write actual code
7. Focus on WhatsApp Business API solution

============================================================
RULES:
============================================================
❌ NO CODE WRITING
❌ NO NUMBERED MENUS
✅ ONLY GUIDE, EXPLAIN, AND SUGGEST
✅ NATURAL CONVERSATION
✅ FOCUS ON WHATSAPP BUSINESS API SOLUTION

Always be the helpful WhatsApp Business API expert Payal! 😊`;

// ============================================================
// 4. FIREBASE FUNCTIONS (User session memory)
// ============================================================

async function getUserFromFirebase(sessionId) {
    try {
        const snapshot = await db.ref(`chat_sessions/${sessionId}`).get();
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.log('Firebase read error:', error.message);
        return null;
    }
}

async function saveUserToFirebase(sessionId, data) {
    try {
        await db.ref(`chat_sessions/${sessionId}`).set(data);
        return true;
    } catch (error) {
        console.log('Firebase write error:', error.message);
        return false;
    }
}

async function updateConversation(sessionId, userMessage, botReply) {
    const userData = await getUserFromFirebase(sessionId);
    const now = Date.now();
    
    if (!userData) {
        const newUser = {
            firstSeen: now,
            lastSeen: now,
            messageCount: 1,
            conversationHistory: [
                { role: "user", message: userMessage, timestamp: now },
                { role: "bot", message: botReply, timestamp: now }
            ]
        };
        await saveUserToFirebase(sessionId, newUser);
        return newUser;
    } else {
        const history = userData.conversationHistory || [];
        history.push({ role: "user", message: userMessage, timestamp: now });
        history.push({ role: "bot", message: botReply, timestamp: now });
        
        if (history.length > 30) {
            history.splice(0, history.length - 30);
        }
        
        userData.lastSeen = now;
        userData.messageCount = (userData.messageCount || 0) + 1;
        userData.conversationHistory = history;
        
        await saveUserToFirebase(sessionId, userData);
        return userData;
    }
}

// ============================================================
// 5. GET AI REPLY (Direct MeshAPI)
// ============================================================
async function getAIReply(userMessage, sessionId) {
    try {
        const userData = await getUserFromFirebase(sessionId);
        let history = userData?.conversationHistory || [];
        
        let formattedHistory = [];
        for (let i = 0; i < history.length; i++) {
            if (history[i].role === "user") {
                formattedHistory.push({ role: "user", content: history[i].message });
            } else if (history[i].role === "bot") {
                formattedHistory.push({ role: "assistant", content: history[i].message });
            }
        }
        
        if (formattedHistory.length > 20) {
            formattedHistory = formattedHistory.slice(-20);
        }
        
        const messages = [
            { role: "system", content: PAYAL_SYSTEM_PROMPT },
            ...formattedHistory,
            { role: "user", content: userMessage }
        ];
        
        console.log(`🤔 Payal thinking... (Session: ${sessionId})`);
        
        const response = await axios.post(
            MESH_API_URL,
            {
                model: MESH_MODEL,
                messages: messages,
                temperature: 0.85,
                max_tokens: 500,
                top_p: 0.9,
                frequency_penalty: 0.5,
                presence_penalty: 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${MESH_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        let aiReply = response.data.choices[0].message.content;
        aiReply = aiReply.replace(/Type HELP for options/gi, '');
        aiReply = aiReply.replace(/\[INST\]/g, '');
        aiReply = aiReply.replace(/\[\/INST\]/g, '');
        
        console.log(`✅ Payal replied (${aiReply.length} chars)`);
        
        await updateConversation(sessionId, userMessage, aiReply);
        
        return aiReply;
        
    } catch (error) {
        console.log('MeshAPI Error:', error.response?.data || error.message);
        
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return "Namaste sir! Main Payal, WhatsApp Business API Solution Expert hun. Aapko bulk messaging, automation, ya WhatsApp bot chahiye? Batao, main guide kar doongi. 😊";
        }
        
        if (msg.includes('platform')) {
            return "Sir, ye WhatsApp Business API platform hai jo businesses ko WhatsApp se reach karne deta hai. Bulk messages, automation, bots sab possible hai. Aap kis use case ke liye use karna chahte ho? 😊";
        }
        
        if (msg.includes('bulk')) {
            return "Sir, bulk message bhejne ke liye platform pe signup karo, device connect karo, numbers list banao aur ek message likho. Sabko ek saath bhej do. Kitne numbers mein bhejna hai? 😊";
        }
        
        if (msg.includes('bot')) {
            return "Sir, WhatsApp bot platform ke webhook feature se bana sakte ho - apna server laga kar. Ya auto-reply feature se - keywords aur replies set karo. Aapko kaunsa tarika chahiye? 😊";
        }
        
        if (msg.includes('api')) {
            return "Sir, API use karne ke liye signup karo, OTP verify karo, API key lo, device connect karo. Phir send API se message bhejo. Kya aapko kisi specific API ke baare mein janna hai? 😊";
        }
        
        if (msg.includes('price') || msg.includes('cost') || msg.includes('kitna')) {
            return "Sir, WhatsApp Business API platform ki pricing flexible hai. Contact support karo, wo custom plan bana denge. Kya aapko demo chahiye? 😊";
        }
        
        if (msg.includes('demo')) {
            return "Sir, demo ke liye platform pe signup karo, free trial available hai. Main guide kar doongi kaise use karna hai. Kya aap signup karoge? 😊";
        }
        
        return "Namaste sir! Main Payal, WhatsApp Business API Solution Expert hun. Aapko bulk messaging, automation, bot, ya koi aur help chahiye? Batao, main guide kar doongi. 😊";
    }
}

// ============================================================
// 6. API ENDPOINTS
// ============================================================

// Send message and get reply
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'message chahiye',
                example: { message: 'Hello Payal!' }
            });
        }
        
        const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`💬 [${sid}] User: ${message}`);
        
        const reply = await getAIReply(message, sid);
        
        res.json({
            success: true,
            sessionId: sid,
            message: message,
            reply: reply,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: 'Something went wrong',
            message: error.message 
        });
    }
});

// Get chat history
app.get('/api/chat/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userData = await getUserFromFirebase(sessionId);
        
        if (userData) {
            res.json({
                success: true,
                sessionId: sessionId,
                history: userData.conversationHistory || [],
                messageCount: userData.messageCount || 0,
                firstSeen: userData.firstSeen,
                lastSeen: userData.lastSeen
            });
        } else {
            res.json({
                success: true,
                sessionId: sessionId,
                history: [],
                messageCount: 0
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear chat history
app.delete('/api/chat/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await db.ref(`chat_sessions/${sessionId}`).remove();
        res.json({
            success: true,
            message: 'History cleared'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all sessions
app.get('/api/sessions', async (req, res) => {
    try {
        const snapshot = await db.ref('chat_sessions').get();
        if (snapshot.exists()) {
            const sessions = snapshot.val();
            const sessionList = Object.keys(sessions).map(sid => ({
                sessionId: sid,
                firstSeen: sessions[sid].firstSeen,
                lastSeen: sessions[sid].lastSeen,
                messageCount: sessions[sid].messageCount
            }));
            res.json({ sessions: sessionList, total: sessionList.length });
        } else {
            res.json({ sessions: [], total: 0 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test API
app.post('/api/test', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message chahiye' });
        }
        
        const reply = await getAIReply(message, 'test_session');
        res.json({
            success: true,
            message: message,
            reply: reply,
            model: MESH_MODEL
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        bot: 'Payal - Web Chat Assistant',
        version: '1.0',
        timestamp: Date.now()
    });
});

// Root
app.get('/', (req, res) => {
    res.json({
        name: 'Payal AI Chat Assistant',
        version: '1.0',
        endpoints: {
            chat: 'POST /api/chat',
            history: 'GET /api/chat/history/:sessionId',
            clear: 'DELETE /api/chat/history/:sessionId',
            sessions: 'GET /api/sessions',
            test: 'POST /api/test',
            health: 'GET /health'
        }
    });
});

// ============================================================
// 7. EXPORT FOR VERCEL
// ============================================================
module.exports = app;

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`✅ Payal running on port ${PORT}`);
        console.log(`🌐 http://localhost:${PORT}`);
    });
}
