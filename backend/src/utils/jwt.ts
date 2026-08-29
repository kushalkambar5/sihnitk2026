import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
};

export const verifyRefreshToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtUserPayload;
};
