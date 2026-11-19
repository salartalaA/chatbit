"use client";

import { useEffect, useState } from "react";

export function useRoomCountdown(expiresAt: Date | string | null) {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (!expiresAt) {
      setFormattedTime("");
      return;
    }

    const expirationTime = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((expirationTime - Date.now()) / 1000)
      );

      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      setFormattedTime(
        [hours, minutes, seconds]
          .map((value) => String(value).padStart(2, "0"))
          .join(":")
      );
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  return formattedTime;
}
