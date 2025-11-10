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
import { usePlanUIStore } from "@/stores/plan-ui-store";
import { updatePlan, getPlanById } from "@/actions/plans/plans";

const formSchema = z.object({
  plan_name: z
    .string()
    .min(2, { message: "Plan name must be at least 2 characters" })
    .max(50, { message: "Plan name must be at most 50 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

type Plan = {
  id: string;
  name: string;
};

export default function EditPlanForm() {
  const isDesktop = useIsMobile();
  const open = usePlanUIStore((s) => s.editOpen);
  const onOpenChange = usePlanUIStore((s) => s.setEditOpen);
  const selectedId = usePlanUIStore((s) => s.selectedPlanId);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Edit your trading plan here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <PlanForm onOpenChange={onOpenChange} selectedId={selectedId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Plan</DrawerTitle>
            <DrawerDescription>
              Edit your trading plan here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <PlanForm
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

function PlanForm({
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
      plan_name: "",
    },
  });

  const { reset } = methods;

  React.useEffect(() => {
    if (!selectedId) return;

    (async () => {
      try {
        const data: Plan = await getPlanById(selectedId);
        reset({
          plan_name: data.name,
        });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message =
          error.response?.data?.message || "Failed to load plan.";
        console.error("Fetch plan error:", message);
        toast.error(message);
      }
    })();
  }, [selectedId, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updatePlan(selectedId, {
        name: values.plan_name,
      });

      toast.success("Plan edited successfully.");
      mutate("/plan/");
      onOpenChange(false);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Plan update failed.";
      console.error("Update plan error:", message);
      toast.error(message);
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

        <Button type="submit">Save Plan</Button>
      </form>
    </FormProvider>
  );
}
