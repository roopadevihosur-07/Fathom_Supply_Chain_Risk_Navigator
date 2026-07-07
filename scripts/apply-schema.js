import dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.VITE_BUTTERBASE_APP_ID;
const API_KEY = process.env.VITE_BUTTERBASE_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: VITE_BUTTERBASE_APP_ID or VITE_BUTTERBASE_API_KEY not set in .env');
  process.exit(1);
}

async function applySchema() {
  try {
    console.log('🔄 Applying schema to Butterbase...');
    console.log(`App ID: ${APP_ID}\n`);

    const schemaPayload = {
      schema: {
        tables: {
          profiles: {
          columns: {
            user_id: { type: 'uuid' },
            role: { type: 'text', nullable: false },
            name: { type: 'text' }
          }
        },
        concerns: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()' },
            title: { type: 'text', nullable: false },
            description: { type: 'text' },
            risk_level: { type: 'text' },
            reporter: { type: 'text' },
            reporter_id: { type: 'uuid' },
            status: { type: 'text', default: "'open'" },
            created_at: { type: 'timestamptz', default: 'now()' }
          }
        },
        suggestions: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()' },
            concern_id: { type: 'uuid', nullable: false },
            title: { type: 'text', nullable: false },
            description: { type: 'text' },
            proposed_by: { type: 'text' },
            status: { type: 'text', default: "'pending'" },
            created_at: { type: 'timestamptz', default: 'now()' }
          }
        },
        solutions: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()' },
            concern_id: { type: 'uuid', nullable: false },
            title: { type: 'text', nullable: false },
            description: { type: 'text' },
            cost: { type: 'integer', default: '0' },
            time_to_resolve: { type: 'integer' },
            coverage: { type: 'text' },
            recommended: { type: 'boolean', default: 'false' },
            created_by: { type: 'text' },
            status: { type: 'text', default: "'active'" },
            created_at: { type: 'timestamptz', default: 'now()' }
          }
        }
      }
      },
      name: 'fathom initial schema'
    };

    console.log('📋 Applying schema via /v1/{appId}/schema/apply endpoint...\n');

    const response = await fetch(`https://api.butterbase.ai/v1/${APP_ID}/schema/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(schemaPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Schema application failed:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ Schema applied successfully!');
    console.log('\n📊 Your Fathom database is ready with 4 tables:');
    console.log('  ✓ profiles (user roles)');
    console.log('  ✓ concerns (issues reported)');
    console.log('  ✓ suggestions (manager proposals)');
    console.log('  ✓ solutions (admin approved fixes)');
    console.log('\n✨ Tables created:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n🎉 Step 2 Complete! Ready for next steps.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applySchema();
