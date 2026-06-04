import { Injectable } from '@angular/core';

interface StoredCourse {
  id: number;
  /** Unix timestamp (ms) after which this entry is discarded. */
  exp: number;
}

/**
 * Manages the "course selected before login" handshake.
 *
 * Flow:
 *   1. User clicks "Inscribirme" → save(cursoId)
 *   2. Navigation goes to /auth/register (or /auth/login for returning users)
 *   3. After successful auth → consume() returns the id → navigate to /registro-pago/:id
 *   4. /registro-pago arrives → clear() so the id isn't reused on the next login
 *
 * TTL prevents a stale id from hijacking future logins (e.g. user opened the tab
 * days ago, logged in later for an unrelated reason, and got sent to an old payment).
 */
@Injectable({ providedIn: 'root' })
export class PendingCourseService {
  private readonly KEY = 'pendingCursoId';
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  /** Persist a selected course. Overwrites any previous value. */
  save(cursoId: number): void {
    const entry: StoredCourse = { id: cursoId, exp: Date.now() + this.TTL_MS };
    localStorage.setItem(this.KEY, JSON.stringify(entry));
  }

  /** Read the id without removing it. Returns null if absent or expired. */
  peek(): number | null {
    return this.readAndMaybeExpire();
  }

  /** Read the id AND remove it. Use this after a successful redirect. */
  consume(): number | null {
    const id = this.readAndMaybeExpire();
    localStorage.removeItem(this.KEY);
    return id;
  }

  /** Explicitly discard the stored id (called when /registro-pago loads). */
  clear(): void {
    localStorage.removeItem(this.KEY);
  }

  private readAndMaybeExpire(): number | null {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);

      // Legacy: plain numeric string written before this service existed
      if (typeof parsed === 'number') {
        return parsed > 0 ? parsed : null;
      }

      const { id, exp } = parsed as StoredCourse;

      if (!Number.isFinite(id) || id <= 0) {
        localStorage.removeItem(this.KEY);
        return null;
      }

      if (Date.now() > exp) {
        localStorage.removeItem(this.KEY);
        return null;
      }

      return id;
    } catch {
      // Malformed JSON → discard
      localStorage.removeItem(this.KEY);
      return null;
    }
  }
}
