require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkAPI() {
  console.log('\n🔍 Diagnosing Gemini API...\n');
  console.log('='.repeat(80));
  
  // Check BOTH possible API key names
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  console.log(`\n1️⃣ API Key Check:`);
  console.log(`   GOOGLE_AI_API_KEY: ${process.env.GOOGLE_AI_API_KEY ? '✅ Found' : '❌ Not found'}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Not found'}`);
  console.log(`   Using: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);
  console.log(`   Length: ${apiKey ? apiKey.length : 0} characters`);
  
  if (!apiKey) {
    console.log('\n❌ No API key found in .env file!');
    return;
  }
  
  // Try a simple request with full error details
  console.log(`\n2️⃣ Testing API Connection:`);
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    console.log(`   ✅ SUCCESS! Response: ${response.text()}`);
  } catch (error) {
    console.log(`   ❌ FAILED!`);
    console.log(`\n   Full Error Details:`);
    console.log(`   Status: ${error.status}`);
    console.log(`   Status Text: ${error.statusText}`);
    console.log(`   Message: ${error.message}`);
    
    if (error.status === 429) {
      console.log(`\n   🚨 RATE LIMIT ERROR - You've exceeded your quota`);
      console.log(`   Solutions:`);
      console.log(`   - Wait for quota to reset (check Google AI Studio)`);
      console.log(`   - Upgrade to paid tier`);
      console.log(`   - Use a different API (Claude, OpenAI, etc.)`);
    } else if (error.status === 403) {
      console.log(`\n   🚨 PERMISSION ERROR - API key invalid or restricted`);
      console.log(`   Solutions:`);
      console.log(`   - Check if API key is correct`);
      console.log(`   - Verify API is enabled in Google Cloud Console`);
      console.log(`   - Check if billing is set up`);
    } else if (error.status === 404) {
      console.log(`\n   🚨 MODEL NOT FOUND - Model doesn't exist or not accessible`);
    }
    
    if (error.errorDetails) {
      console.log(`\n   Error Details:`, JSON.stringify(error.errorDetails, null, 2));
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Check your quota at: https://aistudio.google.com/');
  console.log('📊 Or at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com\n');
}

checkAPI();