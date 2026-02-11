const { Client } = require('pg');

const password = 'C7CvpbJd!LzZ5Wi';
const projectRef = 'bkfmwhglmcrnuvwyfrnr';
const user = `postgres.${projectRef}`;
const db = 'postgres';

const regions = [
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-eu-west-2.pooler.supabase.com',
  'aws-0-eu-west-3.pooler.supabase.com',
  'aws-0-eu-south-1.pooler.supabase.com', // Milan
  'aws-0-eu-north-1.pooler.supabase.com', // Stockholm
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com', // Ohio
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-us-west-2.pooler.supabase.com', // Oregon
  'aws-0-ca-central-1.pooler.supabase.com', // Canada
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-sa-east-1.pooler.supabase.com', // São Paulo
];

async function testConnection(host) {
  console.log(`Testing ${host}...`);
  const client = new Client({
    host: host,
    port: 6543,
    database: db,
    user: user,
    password: password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS: Connected to ${host}`);
    await client.end();
    return host;
  } catch (err) {
    console.log(`❌ FAILED ${host}: ${err.message}`);
    // If we get "password authentication failed", it might mean the region is correct but password wrong.
    // If "Tenant or user not found", it means wrong region (usually).
    return null;
  }
}

async function run() {
  // Install pg if needed: npm install pg
  for (const region of regions) {
    const success = await testConnection(region);
    if (success) {
      console.log(`\n🎉 FOUND CORRECT REGION: ${success}`);
      process.exit(0);
    }
  }
  console.log('\n❌ Could not connect to any region with provided credentials.');
  process.exit(1);
}

run();
