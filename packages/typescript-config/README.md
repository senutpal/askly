# `@workspace/typescript-config`

Shared TypeScript configuration for the workspace.

## Available Configs

- **base.json**: Base configuration for all projects.
- **nextjs.json**: Configuration optimized for Next.js applications.
- **react-library.json**: Configuration for React component libraries.

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
