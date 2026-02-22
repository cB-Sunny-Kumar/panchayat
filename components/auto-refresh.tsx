"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRefresh({ interval = 5000 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, interval);

    return () => clearInterval(intervalId);
  }, [router, interval]);

  return null;
}
