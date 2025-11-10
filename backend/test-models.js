require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash-exp',
  'gemini-flash-1.5',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-2.0-flash-exp'
];

async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "OK" if this works');
    const response = await result.response;
    const text = response.text();
    return { model: modelName, status: '✅ WORKS', response: text };
  } catch (error) {
    return { model: modelName, status: '❌ FAILS', error: error.message.substring(0, 100) };
  }
}

async function testAllModels() {
  console.log('\n🔍 Testing Gemini models...\n');
  console.log('='.repeat(80));
  
  for (const modelName of modelsToTest) {
    const result = await testModel(modelName);
    console.log(`\n${result.status} ${result.model}`);
    if (result.response) {
      console.log(`   Response: ${result.response}`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Testing complete!\n');
}

testAllModels();