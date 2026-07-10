import React, { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useLocation } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden relative">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative z-10">{children}</main>
      <Footer />
      
      {/* Global decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-dot-pattern opacity-40 mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/2 mix-blend-multiply" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-blue-400/5 rounded-full blur-[150px] translate-y-1/3 mix-blend-multiply" />
      </div>
    </div>
  );
}
