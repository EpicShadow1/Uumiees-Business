import { pool, executeWithRetry } from '../config/database';
import { hashPassword, comparePassword } from '../config/auth';
import { CreateUser, UpdateUser, UserResponse } from '../models';

class UserService {
  async create(userData: CreateUser): Promise<UserResponse> {
    const { email, password, name } = userData;

    return executeWithRetry(async () => {
      const hashedPassword = await hashPassword(password);

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id, email, name, created_at, updated_at`,
        [email, hashedPassword, name]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<UserResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, name, created_at, updated_at 
         FROM users WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, password_hash, name, created_at, updated_at 
         FROM users WHERE email = $1`,
        [email]
      );

      return result.rows[0] || null;
    });
  }

  async update(id: number, userData: UpdateUser): Promise<UserResponse | null> {
    const { name, email } = userData;

    return executeWithRetry(async () => {
      // Build dynamic update query
      const updates: string[] = [];
      const values: (string | number)[] = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }

      if (email) {
        updates.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id); // Add id for WHERE clause
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, email, name, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM users WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }

  async verifyPassword(email: string, password: string): Promise<UserResponse | null> {
    // Get user with password_hash
    const result = await pool.query(
      `SELECT id, email, password_hash, name, created_at, updated_at 
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) {
      return null;
    }

    // Return user without password_hash
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  async getAll(limit = 100, offset = 0): Promise<UserResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, name, created_at, updated_at 
         FROM users 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result.rows;
    });
  }
}

export const userService = new UserService();