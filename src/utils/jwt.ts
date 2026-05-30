// utils/jwt.ts
import jwt from 'jsonwebtoken';

export function signToken(payload: object, expiresIn: string = '15m') {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || '';
  return jwt.verify(token, secret) as any;
}
