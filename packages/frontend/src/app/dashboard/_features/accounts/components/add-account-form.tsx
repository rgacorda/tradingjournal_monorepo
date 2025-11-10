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
import { IconPlus } from "@tabler/icons-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createAccount } from "@/actions/accounts/account";
import { mutate } from "swr";
import { AxiosError } from "axios";

const formSchema = z.object({
  // platform: z.string().nonempty("Platform is required"),
  account_name: z
    .string()
    .min(2, { message: "Account name must be at least 2 characters" })
    .max(50, { message: "Account name must be at most 50 characters" }),
  account_value: z
    .number({ invalid_type_error: "Capital must be a number" })
    .int({ message: "Capital must be an integer" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAccountForm({
  open,
  onOpenChange,
}: ProfileFormProps) {
  const isDesktop = useIsMobile();

  if (!isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mx-2">
            <IconPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new Account</DialogTitle>
            <DialogDescription>
              Add your new trading account here. Click add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="mx-2">
          <IconPlus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Add new Account</DrawerTitle>
            <DrawerDescription>
              Add your new trading account here. Click add when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="px-4" onOpenChange={onOpenChange}/>
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

function ProfileForm({
  onOpenChange,
  className,  
}: {
  onOpenChange: (open: boolean) => void;
  className?: string
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

 const onSubmit = async (values: FormValues) => {
  try {
    await createAccount({
      name: values.account_name,
      balance: values.account_value,
    });

    mutate("/account/");
    toast.success("Account created successfully.");
    onOpenChange(false);
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const errorMessage = error.response?.data?.message || "Account creation failed. Please try again.";
    console.error("Account creation error:", errorMessage);
    toast.error(errorMessage);
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
