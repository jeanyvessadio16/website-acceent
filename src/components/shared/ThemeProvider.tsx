"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="acceent-theme"
      {...props}
    >
      <MotionConfig
        reducedMotion={process.env.NODE_ENV === "production" ? "user" : "never"}
      >
        {children}
      </MotionConfig>
    </NextThemesProvider>
  );
}
