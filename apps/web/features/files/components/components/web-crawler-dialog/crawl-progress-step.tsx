"use client";

import { Loader2Icon } from "lucide-react";

export const CrawlProgressStep = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2Icon className="size-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="font-medium">Scanning website for resources...</p>
      </div>
    </div>
  );
};
