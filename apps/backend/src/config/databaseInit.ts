import { pool } from './database';
import { readFileSync } from 'fs';
import { join } from 'path';

export const initializeDatabase = async () => {
  try {
    // Read and execute schema.sql
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      try {
        await pool.query(statement);
      } catch (error) {
        // Ignore errors for IF NOT EXISTS statements
        if (!statement.includes('IF NOT EXISTS') && !statement.includes('CREATE OR REPLACE')) {
          console.error('Error executing statement:', statement);
          throw error;
        }
      }
    }

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
};