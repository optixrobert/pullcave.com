const postgres = require('postgres');

const password = 'C7CvpbJd!LzZ5Wi';
const projectRef = 'bkfmwhglmcrnuvwyfrnr';
const user = `postgres.${projectRef}`;
const db = 'postgres';

const regions = [
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-eu-west-3.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
];

async function testConnection(host) {
  console.log(`Testing ${host} with user ${user}...`);
  
  const sql = postgres({
    host: host,
    port: 6543, // Pooler port
    database: db,
    username: user,
    password: password,
    ssl: 'require',
    connection: {
      application_name: 'test-script'
    }
  });

  try {
    const result = await sql`select version()`;
    console.log(`✅ SUCCESS: Connected to ${host}`);
    console.log(result);
    await sql.end();
    return host;
  } catch (err) {
    console.log(`❌ FAILED ${host}: ${err.message}`);
    await sql.end();
    return null;
  }
}

async function run() {
  for (const region of regions) {
    const success = await testConnection(region);
    if (success) {
      console.log(`\n🎉 FOUND CORRECT REGION: ${success}`);
      process.exit(0);
    }
  }
  console.log('\n❌ Could not connect to any region.');
}

run();
