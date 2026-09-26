"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading";

export default function CrimeRingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/gangs");
  }, [router]);

  return <LoadingSpinner label="Navigating to Module 4 — Gangs & Syndicates..." />;
}
