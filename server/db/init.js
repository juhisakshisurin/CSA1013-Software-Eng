const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function setupDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT || 3306;
  const database = process.env.DB_NAME || 'court_db';

  console.log(`[DB Setup] Attempting connection to MySQL server at ${host}:${port} as ${user}...`);

  try {
    const connection = await mysql.createConnection({ host, user, password, port });

    console.log(`[DB Setup] Creating database '${database}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.query(`USE \`${database}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('[DB Setup] Executing schema.sql DDL script...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.toUpperCase().startsWith('USE')) continue;
        await connection.query(statement);
      }
      console.log('[DB Setup] Schema tables created successfully!');
    }

    if (fs.existsSync(seedPath)) {
      console.log('[DB Setup] Executing seed.sql data script...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.toUpperCase().startsWith('USE')) continue;
        await connection.query(statement);
      }
      console.log('[DB Setup] Seed records inserted successfully!');
    }

    await connection.end();
    console.log('===========================================================');
    console.log('✅ MySQL Database initialization completed successfully!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    console.log('\nTip: Make sure your local MySQL server is running and check DB_USER / DB_PASSWORD in server/.env');
  }
}

setupDatabase();
