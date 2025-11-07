import {
  HTML_SCRIPT,
  JAVASCRIPT_SCRIPT,
  NEXTJS_SCRIPT,
  REACT_SCRIPT,
  type IntegrationId,
} from "./constants";

export const createScript = (
  integrationId: IntegrationId,
  organizationId: string
): string => {
  const map = {
    html: HTML_SCRIPT,
    react: REACT_SCRIPT,
    nextjs: NEXTJS_SCRIPT,
    javascript: JAVASCRIPT_SCRIPT,
  } as const;

  const script = map[integrationId];
  if (!script) throw new Error(`Unknown integration ID: ${integrationId}`);

  return script.replace(/{{ORGANIZATION_ID}}/g, organizationId);
};
