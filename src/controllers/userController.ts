import { Request, Response } from 'express';
import { userService } from '../services';
import { generateToken } from '../config/auth';
import { createSession } from '../middleware/session';
import { getQueryParam, getPathParam } from '../utils/helpers';

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create user
      const user = await userService.create({ email, password, name });

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email });

      // Create session
      const sessionToken = await createSession(user.id, user.email);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Verify credentials
      const user = await userService.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email });

      // Create session
      const sessionToken = await createSession(user.id, user.email);

      res.json({
        message: 'Login successful',
        token,
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { name, email } = req.body;

      const user = await userService.update(req.user.userId, { name, email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const limit = getQueryParam(req.query.limit, 100);
      const offset = getQueryParam(req.query.offset, 0);

      const users = await userService.getAll(limit, offset);
      res.json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(getPathParam(req.params.id), 10);
      const user = await userService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(getPathParam(req.params.id), 10);
      const success = await userService.delete(userId);

      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

export const userController = new UserController();