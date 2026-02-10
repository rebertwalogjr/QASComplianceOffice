"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

export function MultiSelectCommand({
  groups,
  selectedIds,
  onChange
}: {
  groups: any[],
  selectedIds: number[],
  onChange: (ids: number[]) => void
}) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (id: number) => {
    onChange(selectedIds.filter((s) => s !== id));
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      handleUnselect(id);
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select item..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search item..." />
            <CommandList>
              <CommandEmpty>No record found.</CommandEmpty>
              <CommandGroup>
                {groups.map((group) => (
                  <CommandItem
                    key={group.id}
                    onSelect={() => handleSelect(group.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(group.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-1 mt-1">
        {selectedIds.map((id) => {
          const group = groups.find((g) => g.id === id);
          return (
            <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-4">
              <Label className="text-sm">{group?.name}</Label>
              <Button variant="ghost" size="icon-sm" className="hover:text-destructive cursor-pointer" onClick={() => handleUnselect(id)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}