"use client";
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { TimePicker } from "@/components/ui/time-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createTrade } from "@/actions/trades/trades";
import { mutate } from "swr";
import { AxiosError } from "axios";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { format } from "date-fns";

const formSchema = z.object({
  ticker: z.string().min(1, { message: "Ticker is required" }).max(10),
  side: z.enum(["long", "short"], { message: "Side is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
  entry: z.coerce.number().min(0, { message: "Entry price must be positive" }),
  exit: z.coerce.number().min(0, { message: "Exit price must be positive" }),
  accountId: z.string().min(1, { message: "Account is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  realized: z.coerce.number().optional(),
  fees: z.coerce.number().optional(),
  grade: z.coerce.number().min(1, { message: "Grade must be 1-5" }).max(5, { message: "Grade must be 1-5" }).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Account = {
  id: string;
  name: string;
};

interface AddTradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTradeForm({
  open,
  onOpenChange,
}: AddTradeFormProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="mx-2">
            <IconPlus />
            Add Trade
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <DrawerHeader className="text-left">
              <DrawerTitle>Add New Trade</DrawerTitle>
              <DrawerDescription>
                Add a new trade to your journal. Fill in all required fields.
              </DrawerDescription>
            </DrawerHeader>
            <TradeForm className="px-4" onOpenChange={onOpenChange} />
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-2">
          <IconPlus />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
          <DialogDescription>
            Add a new trade to your journal. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>
        <TradeForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

function TradeForm({
  onOpenChange,
  className,
}: {
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const { data: accounts } = useSWR<Account[]>("/account/", fetcher);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      side: "long",
      quantity: 0,
      entry: 0,
      exit: 0,
      accountId: "",
      date: new Date(),
      time: new Date().toTimeString().slice(0, 5),
      realized: 0,
      fees: 0,
      grade: undefined,
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Find the account name from accountId
      const selectedAccount = accounts?.find(acc => acc.id === values.accountId);
      const accountName = selectedAccount?.name || "";

      await createTrade({
        ticker: values.ticker,
        side: values.side,
        quantity: values.quantity,
        entry: values.entry,
        exit: values.exit,
        account: accountName,
        accountId: values.accountId,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        realized: values.realized || 0,
        fees: values.fees || 0,
        grade: values.grade || 0,
        notes: values.notes || "",
        // These fields will be set by defaults in backend
        id: "",
        mistakes: [],
        security: "stock",
        broker: "",
        planId: "",
      });

      mutate("/trade/");
      toast.success("Trade created successfully.");
      onOpenChange(false);
      methods.reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Trade creation failed. Please try again.";
      console.error("Trade creation error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Ticker */}
          <FormField
            name="ticker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticker <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="AAPL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Side */}
          <FormField
            name="side"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Side <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Quantity */}
          <FormField
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entry */}
          <FormField
            name="entry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="150.50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exit */}
          <FormField
            name="exit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="155.75"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Account */}
        <FormField
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <FormField
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time */}
          <FormField
            name="time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Time <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Realized */}
          <FormField
            name="realized"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realized P/L</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="525.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fees */}
          <FormField
            name="fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fees</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="2.50"
                    className="text-red-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade */}
          <FormField
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade (1-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Trade notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Trade</Button>
      </form>
    </FormProvider>
  );
}
