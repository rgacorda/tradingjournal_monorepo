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
import { createPlan } from "@/actions/plans/plans";
import { mutate } from "swr";
import { AxiosError } from "axios";

const formSchema = z.object({
  plan_name: z
    .string()
    .min(2, { message: "Plan name must be at least 2 characters" })
    .max(50, { message: "Plan name must be at most 50 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPlanForm({
  open,
  onOpenChange,
}: AddPlanFormProps) {
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
            <DialogTitle>Add new Plan</DialogTitle>
            <DialogDescription>
              Add your new trading plan here. Click add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <PlanForm onOpenChange={onOpenChange} />
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
            <DrawerTitle>Add new Plan</DrawerTitle>
            <DrawerDescription>
              Add your new trading plan here. Click add when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <PlanForm className="px-4" onOpenChange={onOpenChange} />
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

function PlanForm({
  onOpenChange,
  className,
}: {
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan_name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createPlan({
        name: values.plan_name,
      });

      mutate("/plan/");
      toast.success("Plan created successfully.");
      onOpenChange(false);
      methods.reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || "Plan creation failed. Please try again.";
      console.error("Plan creation error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormField
          name="plan_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Breakout Strategy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Plan</Button>
      </form>
    </FormProvider>
  );
}
