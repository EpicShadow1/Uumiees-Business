declare namespace Express {
  export interface Request {
    session?: {
      userId: number;
      email: string;
      createdAt: number;
      lastAccessed: number;
    };
    user?: {
      userId: number;
      email: string;
    };
  }
}