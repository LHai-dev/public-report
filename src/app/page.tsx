"use client";

import { BottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
      >
        Open bottom sheet
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[0.6, 0.85]}
        title="Quick actions"
        description="Drag the handle, fling, or swipe down to dismiss."
      >
        <ul className="divide-y divide-border">

        </ul>
        <div className="py-12 text-center text-xs text-muted-foreground">
          Fling up to expand, fling down to dismiss.
        </div>
      </BottomSheet>
    </>
  );
}
