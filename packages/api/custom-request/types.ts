import type { UserSelect } from '@api/db/schema';

export interface CustomRequest {
  raw: Request;
  method: string;
  path: string;
  query: URLSearchParams;
  start: number;
  serverTiming: string[];
  cookies: Record<string, string>;
  user: UserSelect | null;
  session?: string;
  ip?: string;
  userAgent: string | null;
  /** Adds a server timing entry calculated from the given start time.
   * @returns {string} The duration in milliseconds.
   */
  addTiming: (name: string, startTime: number, description?: string) => string;
}

export type Handler = (req: CustomRequest) => Promise<Response>;
