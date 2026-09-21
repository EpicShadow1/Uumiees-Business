import { pool, executeWithRetry } from '../config/database';
import { hashPassword, comparePassword } from '../config/auth';
import { CreateUser, UpdateUser, UserResponse } from '../models';

class UserService {
  async create(userData: CreateUser): Promise<UserResponse> {
    const { email, password, name, phone, address, city, state, postal_code, country } = userData;

    return executeWithRetry(async () => {
      const hashedPassword = await hashPassword(password);

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'customer', true, NOW(), NOW())
         RETURNING id, email, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at`,
        [email, hashedPassword, name, phone, address, city, state, postal_code, country]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<UserResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at 
         FROM users WHERE id = $1`,
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, password_hash, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at 
         FROM users WHERE email = $1`,
        [email]
      );

      return result.rows[0] || null;
    });
  }

  async update(id: number, userData: UpdateUser): Promise<UserResponse | null> {
    const { name, email, phone, address, city, state, postal_code, country } = userData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | null)[] = [];
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

      if (phone !== undefined) {
        updates.push(`phone = $${paramCount}`);
        values.push(phone);
        paramCount++;
      }

      if (address !== undefined) {
        updates.push(`address = $${paramCount}`);
        values.push(address);
        paramCount++;
      }

      if (city !== undefined) {
        updates.push(`city = $${paramCount}`);
        values.push(city);
        paramCount++;
      }

      if (state !== undefined) {
        updates.push(`state = $${paramCount}`);
        values.push(state);
        paramCount++;
      }

      if (postal_code !== undefined) {
        updates.push(`postal_code = $${paramCount}`);
        values.push(postal_code);
        paramCount++;
      }

      if (country !== undefined) {
        updates.push(`country = $${paramCount}`);
        values.push(country);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, email, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at
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
    const result = await pool.query(
      `SELECT id, email, password_hash, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at 
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
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      postal_code: user.postal_code,
      country: user.country,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  async getAll(limit = 100, offset = 0): Promise<UserResponse[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT id, email, name, phone, address, city, state, postal_code, country, role, is_active, created_at, updated_at 
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