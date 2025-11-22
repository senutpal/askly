/**
 * Application route paths
 */

/** Public routes */
export const PUBLIC_ROUTES = {
  HOME: '/',
  DOCS: '/docs',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const;

/** Dashboard routes */
export const DASHBOARD_ROUTES = {
  DASHBOARD: '/dashboard',
  CONVERSATIONS: '/conversations',
  CONVERSATION_DETAIL: (id: string) => `/conversations/${id}`,
  KNOWLEDGE_BASE: '/knowledge-base',
  SETTINGS: '/settings',
  INTEGRATIONS: '/integrations',
  CUSTOMIZATION: '/customization',
  PLUGINS: '/plugins',
} as const;

/** All routes combined */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...DASHBOARD_ROUTES,
} as const;
