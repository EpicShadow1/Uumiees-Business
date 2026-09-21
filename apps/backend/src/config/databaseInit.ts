import { pool } from './database';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const resolveSchemaPath = (): string => {
  const candidates = [
    join(__dirname, 'schema.sql'),
    join(__dirname, '..', '..', 'src', 'config', 'schema.sql'),
    join(process.cwd(), 'src', 'config', 'schema.sql'),
    join(process.cwd(), 'dist', 'config', 'schema.sql'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Unable to locate schema.sql. Checked: ${candidates.join(', ')}`);
};

export const initializeDatabase = async () => {
  try {
    const schemaPath = resolveSchemaPath();
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