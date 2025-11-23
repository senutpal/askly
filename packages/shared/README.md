# @workspace/shared

Shared utilities, types, constants, and configurations used across Askly applications.

## Structure

```
src/
├── types/       # Shared TypeScript types and interfaces
├── utils/       # Shared utility functions
├── constants/   # Shared constants and enums
└── config/      # Shared configuration
```

## Usage

```typescript
// Import shared types
import type { ChatMessage, UserRole } from "@workspace/shared/types";

// Import shared utilities
import { formatDate, validateEmail } from "@workspace/shared/utils";

// Import shared constants
import { API_ROUTES, SUPPORTED_LANGUAGES } from "@workspace/shared/constants";

// Import shared config
import { getLanguageConfig } from "@workspace/shared/config";
```

## Adding New Exports

1. Add your file to the appropriate directory
2. Export from the directory's `index.ts`
3. Types are automatically available across the monorepo
