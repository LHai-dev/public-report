const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (ip: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 min
    return true;
  }

  if (attempts.count >= 5) {
    return false; // Too many attempts
  }

  attempts.count++;
  return true;
};
