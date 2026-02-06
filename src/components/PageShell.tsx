import React from "react";

interface PageShellProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

const PageShell = ({ children, maxWidth = "md" }: PageShellProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-16 md:py-24">
      <div className={`w-full ${widths[maxWidth]} animate-fade-in`}>
        {children}
      </div>
    </div>
  );
};

export default PageShell;
