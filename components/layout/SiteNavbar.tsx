"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";

export default function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [hasScrolled, setHasScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(
        window.scrollY > 10
      );
    };

    handleScroll();

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
    <Navbar
      hasScrolled={hasScrolled}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={
        setMobileMenuOpen
      }
    />
  );
}
