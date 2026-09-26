// Anti-spam security token generator and validator

const SECRET_SALT = 'VAY365_SECURITY_TOKEN_SALT_2026_LEAD_DEFENSE';

export interface FormSecurityPayload {
  token: string;
  ts: number;
}

/**
 * Generate a security token on client when form is initialized
 */
export function generateClientSecurityToken(): FormSecurityPayload {
  const ts = Date.now();
  // Simple deterministic client hash with salt
  const str = `${ts}:${SECRET_SALT}:${Math.floor(ts / 3600000)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const token = `SEC-${Math.abs(hash).toString(36)}-${ts.toString(36)}`;
  return { token, ts };
}

/**
 * Validate security token on server (Node.js or Vercel Serverless)
 */
export function validateSecurityToken(token: string | undefined, clientTs: number | undefined): { valid: boolean; reason?: string } {
  if (!token || !clientTs) {
    return { valid: false, reason: 'Missing security token' };
  }

  const now = Date.now();

  // 1. Minimum submission time: humans take at least 2.5 seconds to fill the form
  if (now - clientTs < 2500) {
    return { valid: false, reason: 'Form submitted unnaturally fast (bot detected)' };
  }

  // 2. Maximum token lifetime: 3 hours
  if (now - clientTs > 3 * 3600 * 1000) {
    return { valid: false, reason: 'Security token expired' };
  }

  // 3. Verify token hash
  const str = `${clientTs}:${SECRET_SALT}:${Math.floor(clientTs / 3600000)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const expectedToken = `SEC-${Math.abs(hash).toString(36)}-${clientTs.toString(36)}`;

  if (token !== expectedToken) {
    return { valid: false, reason: 'Invalid security token signature' };
  }

  return { valid: true };
}
