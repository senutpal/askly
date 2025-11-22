"use client";

import { useAuth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "@workspace/ui";
import { dark, neobrutalism } from "@clerk/themes";
import * as React from "react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is required");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ThemeSyncWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  const appearance = React.useMemo(
    () => ({
      baseTheme: resolvedTheme === "dark" ? dark : neobrutalism,
    }),
    [resolvedTheme]
  );

  return (
    <ClerkProvider appearance={appearance}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Toaster />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeSyncWrapper>{children}</ThemeSyncWrapper>
    </ThemeProvider>
  );
}
