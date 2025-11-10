"use client";
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
  import { AxiosError } from "axios";
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
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { mutate } from "swr";
import { useAccountUIStore } from "@/stores/account-ui-store";
import { updateAccount, getAccountById } from "@/actions/accounts/account";
// import { Account } from "./columns";

const formSchema = z.object({
  account_name: z
    .string()
    .min(2, { message: "Account name must be at least 2 characters" })
    .max(50, { message: "Account name must be at most 50 characters" }),
  account_value: z
    .number({ invalid_type_error: "Capital must be a number" })
    .int({ message: "Capital must be an integer" }),
});

type FormValues = z.infer<typeof formSchema>;

type Account = {
  id: string;
  name: string;
  balance: number;
  // platform: string;
};

export default function EditAccountForm() {
  const isDesktop = useIsMobile();
  const open = useAccountUIStore((s) => s.editOpen);
  const onOpenChange = useAccountUIStore((s) => s.setEditOpen);
  const selectedId = useAccountUIStore((s) => s.selectedAccountId);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Edit your trading account here. Click save when you&apos;re done.
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
            <DrawerTitle>Edit Account</DrawerTitle>
            <DrawerDescription>
              Edit your trading account here. Click save when you&apos;re done.
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
      // platform: "",
      account_name: "",
      account_value: 1000,
    },
  });

  // const [platformValue, setPlatformValue] = React.useState("");

  // const { setValue } = methods;

  // React.useEffect(() => {
  //   setValue("platform", platformValue);
  // }, [platformValue, setValue]);
  const { reset } = methods;



  React.useEffect(() => {
    if (!selectedId) return;

    (async () => {
      try {
        const data: Account = await getAccountById(selectedId);
        reset({
          account_name: data.name,
          account_value: Number(data.balance),
        });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message =
          error.response?.data?.message || "Failed to load account.";
        console.error("Fetch account error:", message);
        toast.error(message);
      }
    })();
  }, [selectedId, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateAccount(selectedId, {
        name: values.account_name,
        balance: Number(values.account_value),
      });

      toast.success("Account edited successfully.");
      mutate("/account/");
      onOpenChange(false);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Account update failed.";
      console.error("Update account error:", message);
      toast.error(message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {/* <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <PlatformInput value={platformValue} setValue={setPlatformValue} />
        </div> */}

        <FormField
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Scalp Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="account_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Account</Button>
      </form>
    </FormProvider>
  );
}
