import dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.VITE_BUTTERBASE_APP_ID;
const API_KEY = process.env.VITE_BUTTERBASE_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: VITE_BUTTERBASE_APP_ID or VITE_BUTTERBASE_API_KEY not set in .env');
  process.exit(1);
}

const users = [
  { email: 'admin@fathom.com', password: 'Fathom@2026!', role: 'admin', name: 'Admin User' },
  { email: 'manager@fathom.com', password: 'Fathom@2026!', role: 'manager', name: 'Manager User' },
  { email: 'user@fathom.com', password: 'Fathom@2026!', role: 'user', name: 'Regular User' },
];

async function createUser(email, password) {
  try {
    const response = await fetch(`https://api.butterbase.ai/auth/${APP_ID}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        display_name: email.split('@')[0],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`    ❌ Failed to create ${email}:`, data.error || data.message);
      return null;
    }

    return data.user?.id || data.user_id || data.id;
  } catch (error) {
    console.error(`    ❌ Error creating ${email}:`, error.message);
    return null;
  }
}

async function setUserRole(userId, role) {
  try {
    const response = await fetch(`https://api.butterbase.ai/v1/${APP_ID}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        user_id: userId,
        role: role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`    ❌ Failed to set role for ${userId}:`, data.error || data.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`    ❌ Error setting role:`, error.message);
    return false;
  }
}

async function createUsers() {
  try {
    console.log('👥 Creating demo users...');
    console.log(`App ID: ${APP_ID}\n`);

    console.log('📝 Step 1: Signing up users\n');

    const userIds = {};

    for (const user of users) {
      console.log(`  • Creating ${user.email}...`);
      const userId = await createUser(user.email, user.password);

      if (userId) {
        userIds[user.email] = { id: userId, role: user.role, name: user.name };
        console.log(`    ✓ Created with ID: ${userId}`);
      } else {
        console.log(`    ⚠️  Skipped (may already exist)`);
      }
    }

    console.log('\n📋 Step 2: Assigning roles\n');

    for (const user of users) {
      if (userIds[user.email]) {
        console.log(`  • Setting ${user.email} role to "${user.role}"...`);
        const success = await setUserRole(userIds[user.email].id, user.role);
        if (success) {
          console.log(`    ✓ Role assigned`);
        }
      }
    }

    console.log('\n✅ Demo users created successfully!');
    console.log('\n📊 Demo Credentials:');
    console.log('  ┌─────────────────────────────────┐');
    console.log('  │ Admin                           │');
    console.log('  │ Email: admin@fathom.com         │');
    console.log('  │ Password: Fathom@2026!          │');
    console.log('  └─────────────────────────────────┘');
    console.log('  ┌─────────────────────────────────┐');
    console.log('  │ Manager                         │');
    console.log('  │ Email: manager@fathom.com       │');
    console.log('  │ Password: Fathom@2026!          │');
    console.log('  └─────────────────────────────────┘');
    console.log('  ┌─────────────────────────────────┐');
    console.log('  │ User                            │');
    console.log('  │ Email: user@fathom.com          │');
    console.log('  │ Password: Fathom@2026!          │');
    console.log('  └─────────────────────────────────┘');

    console.log('\n✨ User Details:');
    console.log(JSON.stringify(userIds, null, 2));

    console.log('\n🎉 Step 4 Complete! Ready for Step 5-7 (Wire up Frontend)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUsers();
