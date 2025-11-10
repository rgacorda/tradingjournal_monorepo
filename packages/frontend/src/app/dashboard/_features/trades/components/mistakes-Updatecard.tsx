"use client";
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { mutate } from "swr";
import { useTradeUIStore } from "@/stores/trade-ui-store";
import {
  getTradebyId,
  updateTrade,
  getTrades,
  Trade,
} from "@/actions/trades/trades";
import { Badge } from "@/components/ui/badge";
import { AxiosError } from "axios";

const formSchema = z.object({
  mistake_input: z
    .string()
    .min(1, { message: "Mistake is required" })
    .max(50, { message: "Mistake must be at most 50 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MistakesUpdateCard() {
  const isDesktop = useIsMobile();
  const open = useTradeUIStore((s) => s.editOpen);
  const onOpenChange = useTradeUIStore((s) => s.setEditOpen);
  const selectedId = useTradeUIStore((s) => s.selectedTradeId);

  if (!isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Mistakes</DialogTitle>
            <DialogDescription>
              Add your Mistakes here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <AccountForm onOpenChange={onOpenChange} selectedId={selectedId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Mistakes</DrawerTitle>
            <DrawerDescription>
              Add your Mistakes here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <AccountForm
            className="px-4"
            onOpenChange={onOpenChange}
            selectedId={selectedId}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function AccountForm({
  className,
  selectedId,
  onOpenChange,
}: {
  className?: string;
  selectedId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mistake_input: "",
    },
  });

  const [mistakes, setMistakes] = React.useState<string[]>([]);
  const [previousMistakes, setPreviousMistakes] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Fetch all previous mistakes from all trades
  React.useEffect(() => {
    const fetchAllMistakes = async () => {
      try {
        const trades = await getTrades();
        if (Array.isArray(trades)) {
          // Extract all unique mistakes from all trades
          const allMistakes = trades.reduce((acc: string[], trade: Trade) => {
            if (Array.isArray(trade.mistakes)) {
              return [...acc, ...trade.mistakes];
            }
            return acc;
          }, []);
          // Remove duplicates and filter strings only
          const uniqueMistakes = Array.from(new Set(allMistakes)).filter(
            (m): m is string => typeof m === "string"
          );
          setPreviousMistakes(uniqueMistakes);
        }
      } catch (err) {
        console.error("Failed to fetch previous mistakes:", err);
      }
    };

    fetchAllMistakes();
  }, []);

  React.useEffect(() => {
    if (!selectedId) return;

    const fetchTrade = async () => {
      try {
        const trade = await getTradebyId(selectedId);
        if (Array.isArray(trade?.mistakes)) {
          setMistakes(trade.mistakes);
        }
      } catch (err) {
        const error = err as AxiosError;
        const message = error.message || "Failed to fetch trade data.";
        toast.error(message);
      }
    };

    fetchTrade();
  }, [selectedId]);

  // Add mistake using form validation or from combobox
  const handleAddMistake = async (value?: string) => {
    const inputValue = value || methods.getValues("mistake_input").trim();

    if (!inputValue) {
      return;
    }

    // Validate if not coming from combobox selection
    if (!value) {
      const isValid = await methods.trigger("mistake_input");
      if (!isValid) return;
    }

    if (!mistakes.includes(inputValue)) {
      setMistakes((prev) => [...prev, inputValue]);
      methods.setValue("mistake_input", "");
      setSearchValue("");
      setOpen(false);
    }
  };

  // Save the mistakes array
  const onSubmit = async () => {
    if (!selectedId) return;

    try {
      await updateTrade(selectedId, { mistakes }); // <-- Save the array
      mutate("/trade/");
      toast.success("Mistakes updated successfully.");
      onOpenChange(false);
    } catch (err) {
      const error = err as AxiosError;
      const message = error.message || "Failed to update mistakes.";
      toast.error(message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className={cn("grid items-start gap-4", className)}>
        <FormField
          name="mistake_input"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mistakes</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <div className="flex gap-2">
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "flex-1 justify-between",
                          !searchValue && "text-muted-foreground"
                        )}
                      >
                        {searchValue || "Select or type a mistake..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddMistake()}
                    className="shrink-0 p-2"
                    aria-label="Add mistake"
                  >
                    <PlusIcon size={18} />
                  </Button>
                </div>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search or type new mistake..."
                      value={searchValue}
                      onValueChange={(value) => {
                        setSearchValue(value);
                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMistake();
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="text-sm text-muted-foreground p-2">
                          No previous mistakes found. Press Enter to add &quot;
                          {searchValue}&quot;
                        </div>
                      </CommandEmpty>
                      {previousMistakes.length > 0 && (
                        <CommandGroup heading="Previous Mistakes">
                          {previousMistakes
                            .filter(
                              (mistake) =>
                                !mistakes.includes(mistake) &&
                                mistake
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase())
                            )
                            .map((mistake) => (
                              <CommandItem
                                key={mistake}
                                value={mistake}
                                onSelect={(value) => {
                                  handleAddMistake(value);
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", "opacity-0")}
                                />
                                {mistake}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          {mistakes.map((item, index) => (
            <Badge key={index} variant={"outline"}>
              {item}
              <button
                type="button"
                className="text-red-500 ml-2"
                onClick={() => {
                  setMistakes((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>

        <Button type="button" onClick={onSubmit}>
          Save
        </Button>
      </form>
    </FormProvider>
  );
}
