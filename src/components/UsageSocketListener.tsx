"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket-client";
import { useAppDispatch } from "@/store/hooks";
import { setUsageForTool } from "@/store/slices/usageSlice";

export function UsageSocketListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("usage:update", (data) => {
      dispatch(
        setUsageForTool({
          toolId: data.toolId,
          used: data.used,
          remaining: data.remaining,
        })
      );
    });

    return () => {
      socket.off("usage:update");
    };
  }, [dispatch]);

  return null;
}
