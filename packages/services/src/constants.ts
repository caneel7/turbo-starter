export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
export const SMTP_USER = process.env.SMTP_USER || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || '';
export const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT || '';
export const BASE_URL = process.env.BASE_URL || '';