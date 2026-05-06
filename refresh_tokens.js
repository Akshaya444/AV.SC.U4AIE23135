const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  clientID: '39570e61-80b6-4754-9c14-ee0cff41d117',
  clientSecret: 'vaUqmvKgUfQjQyhA',
  email: 'akshayaputti7@gmail.com',
  name: 'p.akshaya',
  rollNo: 'av.sc.u4aie23135',
  accessCode: 'PTBMmQ'
};

const FILES_TO_UPDATE = [
  path.join(__dirname, 'logging_middleware/logger.js'),
  path.join(__dirname, 'notification_app_be/priorityInbox.js'),
  path.join(__dirname, 'notification_app_fe/app/api/notifications/route.ts')
];

async function refreshToken() {
  console.log('🔄 Fetching fresh token...');
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/auth', CONFIG);
    const newToken = response.data.access_token;
    
    if (!newToken) throw new Error('Token not found in response');
    
    console.log('✅ New token acquired.');

    for (const file of FILES_TO_UPDATE) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // Simple regex to find the TOKEN constant and replace its value
        const updatedContent = content.replace(/const TOKEN =[\s\n]*["'].*?["'];?/, `const TOKEN = "${newToken}";`);
        fs.writeFileSync(file, updatedContent);
        console.log(`📝 Updated ${path.basename(file)}`);
      }
    }
    
    console.log('\n🚀 All tokens updated! Restart your dev server if needed.');
  } catch (err) {
    console.error('❌ Failed to refresh token:', err.message);
    if (err.response) console.error(JSON.stringify(err.response.data));
  }
}

refreshToken();
