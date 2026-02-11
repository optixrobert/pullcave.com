// We use require because we are running with node directly
const postgres = require('postgres');

// Original URL from .env (the one that was failing with pg/Prisma)
// "postgresql://postgres:C7CvpbJd%21LzZ5Wi@db.bkfmwhglmcrnuvwyfrnr.supabase.co:5432/postgres"

const connectionString = 'postgresql://postgres:C7CvpbJd%21LzZ5Wi@db.bkfmwhglmcrnuvwyfrnr.supabase.co:5432/postgres';

async function test() {
  console.log('Testing connection with postgres.js...');
  const sql = postgres(connectionString);

  try {
    const result = await sql`select version()`;
    console.log('✅ Connection successful!');
    console.log(result);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await sql.end();
  }
}

test();
