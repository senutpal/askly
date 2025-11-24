"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn
} from "@workspace/ui"; 
import { Check, Copy, Smartphone, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useVapiPhoneNumbers } from "../hooks/use-vapi-data";


const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        isActive
          ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      )}
    >
      <span className="relative flex h-2 w-2">
        {isActive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 duration-1000"></span>
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            isActive ? "bg-emerald-500" : "bg-zinc-400"
          )}
        ></span>
      </span>
      <span className="capitalize tracking-wide">{status || "Unknown"}</span>
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative ml-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
      aria-label="Copy phone number"
    >
      <div
        className={cn(
          "absolute transition-all duration-300 ease-out",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy className="size-3.5" />
      </div>
      <div
        className={cn(
          "absolute transition-all duration-300 ease-out",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="size-3.5 text-emerald-500" />
      </div>
    </button>
  );
};


export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();

  return (
    <div className="w-full space-y-4">
      

      <div className="overflow-hidden  border border-border/50 bg-background/50 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="h-12 px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                Phone Number
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                Label
              </TableHead>
              <TableHead className="h-12 px-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(1)].map((_, i) => (
                <TableRow key={i} className="border-b border-border/40 hover:bg-transparent">
                  <TableCell className="px-6 py-4">
                    <div className="h-4 w-32 animate-pulse  bg-muted/50" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 w-24 animate-pulse bg-muted/50" />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="ml-auto h-6 w-20 animate-pulse bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : phoneNumbers.length === 0 ? (
              // Minimal Empty State
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
                      <AlertCircle className="size-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium">No numbers configured</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              phoneNumbers.map((phone) => (
                <TableRow
                  key={phone.id}
                  className="group border-b border-border/40 transition-colors hover:bg-muted/30"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/40 text-muted-foreground transition-colors group-hover:bg-background group-hover:text-primary group-hover:shadow-sm">
                        <Smartphone className="size-4" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm font-medium tracking-tight text-foreground">
                          {phone.number || "—"}
                        </span>
                        {phone.number && <CopyButton text={phone.number} />}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {phone.name || "Unnamed"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <StatusBadge status={phone.status || "unknown"} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};