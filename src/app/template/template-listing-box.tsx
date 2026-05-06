"use client";

import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@/components/ui/listbox";
import { Template } from "@/db/schema";
import { ApiResponse } from "@/types/api-response.type";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import Particle from "@/components/p-alert-7";
import { DotmSquare5 } from "@/components/ui/dotm-square-5";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TemplateListingBox() {
  const getAllTemplate = async () => {
    const res = await apiFetch<ApiResponse<Template[]>>("/api/template");

    if (res.error || !res.value) {
      toast.error(`failed to fetch template`);
      throw new Error("Failed to fetch template listing");
    }

    return res.value;
  };

  const {
    data: apiResponse,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["template"],
    queryFn: getAllTemplate,
  });

  if (isPending) {
    return (
      <div className="text-muted-foreground grid animate-pulse place-items-center p-4">
        <DotmSquare5 />
      </div>
    );
  }

  if (!apiResponse || isError) {
    return <Particle />;
  }

  if (!apiResponse.success) {
    return <div className="text-destructive">failed to load</div>;
  }

  const template = apiResponse.data;

  return (
    <div className="w-6xl place-self-center">
      <div className="mt-4 flex items-center justify-between gap-4 pb-3">
        <Link href="/template/create">
          <Button>
            <Plus />
            Create Template
          </Button>
        </Link>
      </div>

      <Listbox>
        {template.map((item) => (
          <ListboxItem key={item.id} value={item.id.toString()}>
            <div className="flex flex-col">
              <div className="font-medium">{item.name}</div>
              <div className="text-muted-foreground text-sm">
                {item.commune}
              </div>
            </div>
            <ListboxItemIndicator />
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
