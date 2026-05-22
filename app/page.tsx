"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
// ============================================================================
// STRUCTURAL TYPES & INTERFACES
// ============================================================================

interface NavLink {
  label: string;
  href: string;
}

interface ToolBadge {
  name: string;
}

interface AuditRecommendation {
  tool: string;
  action: string;
  savingsLabel: string;
  context: string;
}

interface StatItem {
  value: string;
  label: string;
  description: string;
}

interface ProblemCard {
  title: string;
  tagline: string;
  description: string;
  metricBaseline: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  context: string;
}

interface FeatureItem {
  title: string;
  description: string;
  badge: string;
}

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  companyContext: string;
  realizedSavings: string;
}

export default function Home(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Form Interactive State Simulation
  const [inputChatGpt, setInputChatGpt] = useState<string>("20");
  const [inputClaude, setInputClaude] = useState<string>("15");
  const [inputCursor, setInputCursor] = useState<string>("12");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const executeSimulatedAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 900);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* ─── 1. NAVBAR COMPONENT ───────────────────────── */}
      <Navbar
  hasScrolled={hasScrolled}
  mobileMenuOpen={mobileMenuOpen}
  setMobileMenuOpen={setMobileMenuOpen}
/>

      {/* ─── 2. HERO SECTION ───────────────────────────── */}
      <Hero />

      {/* Additional sections (Problems, Process, Features, Testimonials) would go here */}
    </div>
  );
}
