import { pool } from './database';
import { readFileSync } from 'fs';
import { join } from 'path';

export const initializeDatabase = async () => {
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8').trim();

    if (!schema) {
      throw new Error('Database schema is empty');
    }

    await pool.query(schema);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
};