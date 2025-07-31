#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Ecom Bliss Backend Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
} else {
  console.log('📝 Creating .env file...');
  
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ env.example file not found!');
    process.exit(1);
  }

  // Read example file
  let envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Generate secrets
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  
  // Replace placeholder secrets
  envContent = envContent.replace('your-super-secret-jwt-key-change-this-in-production', jwtSecret);
  envContent = envContent.replace('your-session-secret-key-change-this-in-production', sessionSecret);
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
}

console.log('\n📋 Environment Variables Status:');
console.log('================================');

// Check required environment variables
const requiredVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'FRONTEND_URL',
  'BACKEND_URL',
  'SESSION_SECRET'
];

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

console.log('\nRequired Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName} - Set`);
  } else {
    console.log(`❌ ${varName} - Not set (will use default)`);
  }
});

console.log('\nOptional Variables (for Google OAuth):');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName} - Set`);
  } else {
    console.log(`⚠️  ${varName} - Not set (Google OAuth disabled)`);
  }
});

console.log('\n🔧 Next Steps:');
console.log('==============');
console.log('1. Start MongoDB: mongod');
console.log('2. Install dependencies: npm install');
console.log('3. Start the server: npm run dev');
console.log('4. Test the API: curl http://localhost:5000');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('\n🌐 Google OAuth Setup (Optional):');
  console.log('==================================');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Google+ API');
  console.log('4. Create OAuth 2.0 credentials');
  console.log('5. Add redirect URI: http://localhost:5000/api/auth/google/callback');
  console.log('6. Copy Client ID and Secret to .env file');
}

console.log('\n🎉 Setup complete! Happy coding! 🚀'); 