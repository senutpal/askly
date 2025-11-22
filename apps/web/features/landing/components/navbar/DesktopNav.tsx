"use client";

import React from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface DesktopNavProps {
  links: NavLink[];
}

/**
 * DesktopNav - Desktop navigation links
 * Hidden on mobile, horizontal layout on desktop
 */
export const DesktopNav = React.memo<DesktopNavProps>(({ links }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4 transition-colors duration-200"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
});

DesktopNav.displayName = "DesktopNav";
