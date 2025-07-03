interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

class RateLimiter {
  private attempts: Map<string, LoginAttempt> = new Map();

  isRateLimited(email: string): boolean {
    const attempt = this.attempts.get(email);
    if (!attempt) return false;

    const now = Date.now();
    if (now - attempt.lastAttempt > RATE_LIMIT_WINDOW) {
      this.attempts.delete(email);
      return false;
    }

    return attempt.count >= MAX_ATTEMPTS;
  }

  recordAttempt(email: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(email);

    if (!attempt || now - attempt.lastAttempt > RATE_LIMIT_WINDOW) {
      this.attempts.set(email, { count: 1, lastAttempt: now });
    } else {
      this.attempts.set(email, { 
        count: attempt.count + 1, 
        lastAttempt: now 
      });
    }
  }

  getRemainingTime(email: string): number {
    const attempt = this.attempts.get(email);
    if (!attempt) return 0;

    const elapsed = Date.now() - attempt.lastAttempt;
    return Math.max(0, RATE_LIMIT_WINDOW - elapsed);
  }
}

export const rateLimiter = new RateLimiter();