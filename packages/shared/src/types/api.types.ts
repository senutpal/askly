/**
 * API-related types
 */

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface ApiHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  [key: string]: string | undefined;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: ApiHeaders;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

/** Webhook types */
export interface WebhookPayload<T = unknown> {
  type: string;
  id: string;
  timestamp: number;
  data: T;
}

export interface ClerkWebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted' | 'organization.created' | 'organization.updated' | 'organization.deleted';
  data: {
    id: string;
    [key: string]: unknown;
  };
}

export interface VapiWebhookEvent {
  type: 'call.started' | 'call.ended' | 'transcript.updated';
  callId: string;
  timestamp: number;
  data: Record<string, unknown>;
}
