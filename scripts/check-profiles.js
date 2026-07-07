import dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.VITE_BUTTERBASE_APP_ID;
const API_KEY = process.env.VITE_BUTTERBASE_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: Missing credentials in .env');
  process.exit(1);
}

async function checkProfiles() {
  try {
    console.log('📊 Checking profiles table...\n');

    const response = await fetch(`https://api.butterbase.ai/v1/${APP_ID}/profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Profiles in database:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProfiles();
