import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserModel } from '../db/models/User.js';
import crypto from 'crypto';
import { SessionModel } from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const registerUser = async (payload) => {
  const existingUser = await UserModel.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return UserModel.create({ ...payload, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await SessionModel.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return SessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};


export const refreshSession = async ({ refreshToken }) => {
  const session = await SessionModel.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await SessionModel.deleteOne({ _id: session._id });

  const newAccessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  return SessionModel.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};


export const logoutUser = async ({ refreshToken }) => {
  const session = await SessionModel.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await SessionModel.deleteOne({ _id: session._id });
};


export const sendResetEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 5 minutes.</p>`,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};


export const resetPassword = async ({ token, password }) => {
  let email;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });

  await SessionModel.deleteOne({ userId: user._id });
};
