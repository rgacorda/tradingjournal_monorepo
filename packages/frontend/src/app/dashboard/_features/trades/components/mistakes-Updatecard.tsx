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
import { getTradebyId, updateTrade, Trade } from "@/actions/trades/trades";
import {
  getMistakes,
  createMistake,
  Mistake,
} from "@/actions/mistakes/mistakes";
import { Badge } from "@/components/ui/badge";
import { AxiosError } from "axios";

const formSchema = z.object({
  mistake_input: z
    .string()
    .min(1, { message: "Mistake is required" })
    .max(100, { message: "Mistake must be at most 100 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MistakesUpdateCard() {
  const isMobile = useIsMobile();
  const open = useTradeUIStore((s) => s.mistakesOpen);
  const onOpenChange = useTradeUIStore((s) => s.setMistakesOpen);
  const selectedId = useTradeUIStore((s) => s.selectedTradeId);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} modal={true}>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
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

  const [selectedMistakes, setSelectedMistakes] = React.useState<Mistake[]>([]);
  const [allMistakes, setAllMistakes] = React.useState<Mistake[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Fetch all mistakes from the database
  React.useEffect(() => {
    const fetchAllMistakes = async () => {
      try {
        const mistakes = await getMistakes();
        if (Array.isArray(mistakes)) {
          setAllMistakes(mistakes);
        }
      } catch (err) {
        console.error("Failed to fetch mistakes:", err);
      }
    };

    fetchAllMistakes();
  }, []);

  // Fetch current trade's mistakes
  React.useEffect(() => {
    if (!selectedId) return;

    const fetchTrade = async () => {
      try {
        const trade = await getTradebyId(selectedId);
        if (Array.isArray(trade?.Mistakes)) {
          setSelectedMistakes(trade.Mistakes);
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
  const handleAddMistake = async (mistakeToAdd?: Mistake | string) => {
    try {
      let mistake: Mistake;

      if (typeof mistakeToAdd === "object") {
        // Selected from existing mistakes
        mistake = mistakeToAdd;
      } else {
        // Create new or use typed value
        const inputValue =
          mistakeToAdd || methods.getValues("mistake_input").trim();

        if (!inputValue) {
          return;
        }

        // Validate if not coming from combobox selection
        if (!mistakeToAdd) {
          const isValid = await methods.trigger("mistake_input");
          if (!isValid) return;
        }

        // Check if mistake already exists in database
        const existingMistake = allMistakes.find(
          (m) => m.name.toLowerCase() === inputValue.toLowerCase()
        );

        if (existingMistake) {
          mistake = existingMistake;
        } else {
          // Create new mistake
          const newMistake = await createMistake(inputValue);
          mistake = newMistake;
          // Update local state with new mistake
          setAllMistakes((prev) => [...prev, newMistake]);
        }
      }

      // Add to selected if not already there
      if (!selectedMistakes.find((m) => m.id === mistake.id)) {
        setSelectedMistakes((prev) => [...prev, mistake]);
      }

      methods.setValue("mistake_input", "");
      setSearchValue("");
      setOpen(false);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to add mistake.");
    }
  };

  // Save the mistakes array
  const onSubmit = async () => {
    if (!selectedId) return;

    try {
      const mistakeIds = selectedMistakes.map((m) => m.id);
      await updateTrade(selectedId, { mistakeIds });
      mutate("/trade/");
      toast.success("Mistakes updated successfully.");
      onOpenChange(false);
    } catch (err) {
      const error = err as AxiosError;
      const message = error.message || "Failed to update mistakes.";
      toast.error(message);
    }
  };

  // Filter available mistakes (not already selected)
  const availableMistakes = allMistakes.filter(
    (m) =>
      !selectedMistakes.find((sm) => sm.id === m.id) &&
      m.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                          No mistakes found. Press Enter to add &quot;
                          {searchValue}&quot;
                        </div>
                      </CommandEmpty>
                      {availableMistakes.length > 0 && (
                        <CommandGroup heading="Available Mistakes">
                          {availableMistakes.map((mistake) => (
                            <CommandItem
                              key={mistake.id}
                              value={mistake.name}
                              onSelect={() => {
                                handleAddMistake(mistake);
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", "opacity-0")}
                              />
                              {mistake.name}
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
          {selectedMistakes.map((mistake) => (
            <Badge key={mistake.id} variant={"outline"}>
              {mistake.name}
              <button
                type="button"
                className="text-red-500 ml-2"
                onClick={() => {
                  setSelectedMistakes((prev) =>
                    prev.filter((m) => m.id !== mistake.id)
                  );
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
