/**
 * Date formatting utilities
 */

/**
 * Format a timestamp to a human-readable date string
 */
export function formatDate(timestamp: number, locale: string = 'en-US'): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a timestamp to a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number, locale: string = 'en-US'): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
        -interval,
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return 'just now';
}

/**
 * Format a timestamp to time only (e.g., "2:30 PM")
 */
export function formatTime(timestamp: number, locale: string = 'en-US'): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a timestamp to date and time
 */
export function formatDateTime(timestamp: number, locale: string = 'en-US'): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
