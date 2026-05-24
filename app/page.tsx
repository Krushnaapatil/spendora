"use client";

import { useEffect, useState } from "react";

import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import InteractiveAudit from "@/components/landing/InteractiveAudit";
import Problem from "@/components/landing/Problem";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import TrustSection from "@/components/landing/TrustSection";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import FinalCTA from "@/components/landing/FinalCTA";

export default function Home() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    hasScrolled,
    setHasScrolled,
  ] = useState(false);

  useEffect(() => {
    const handleScroll =
      () => {
        setHasScrolled(
          window.scrollY > 10
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-zinc-950">
      <Navbar
        hasScrolled={hasScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={
          setMobileMenuOpen
        }
      />

      <Hero />

      <Stats />

      <Problem />

      <HowItWorks />

      <Features />

      <InteractiveAudit />

      <Testimonials />

      <TrustSection />

      <FinalCTA />

      <Footer />
    </main>
  );
}
