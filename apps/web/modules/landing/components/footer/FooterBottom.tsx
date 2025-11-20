"use client";

import React from "react";
import { InfoBadge } from "@workspace/ui/components/info-badge";

/**
 * FooterBottom - Legal and credits section
 * Copyright notice and technology badges
 */
export const FooterBottom = React.memo(() => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-sm text-gray-500 dark:text-gray-500">
      <div className="space-y-2">
        <p>© {new Date().getFullYear()} ASKLY. All rights reserved.</p>
        <p>Built for educational institutions by Utpal Sen</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <InfoBadge text="Next.js 15" />
        <InfoBadge text="Powered by AI" />
        <InfoBadge text="Made in India" icon="🇮🇳" />
      </div>
    </div>
  );
});

FooterBottom.displayName = "FooterBottom";
