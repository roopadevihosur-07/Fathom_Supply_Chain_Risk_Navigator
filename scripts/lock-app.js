import dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.VITE_BUTTERBASE_APP_ID;
const API_KEY = process.env.VITE_BUTTERBASE_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: VITE_BUTTERBASE_APP_ID or VITE_BUTTERBASE_API_KEY not set in .env');
  process.exit(1);
}

async function lockApp() {
  try {
    console.log('🔒 Locking app to authenticated users only...');
    console.log(`App ID: ${APP_ID}\n`);

    const payload = {
      tables: []
    };

    const response = await fetch(`https://api.butterbase.ai/v1/${APP_ID}/secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to lock app:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ App locked successfully!');
    console.log('\n📋 Access Control Settings:');
    console.log('  • Access Mode: authenticated');
    console.log('  • Anonymous Access: ❌ Disabled');
    console.log('  • Authenticated Users: ✅ Can read/write all tables');
    console.log('  • Row-Level Security: None (everyone sees everything)');

    console.log('\n📊 Affected Tables:');
    console.log('  ✓ profiles');
    console.log('  ✓ concerns');
    console.log('  ✓ suggestions');
    console.log('  ✓ solutions');

    console.log('\n✨ Response:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n🎉 Step 3 Complete! Ready for Step 4 (Create Demo Users)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

lockApp();
