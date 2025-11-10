import { createPlan } from "@/actions/plans/plans";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function TiptapEditor({ open, onOpenChange }: ProfileFormProps) {
  const isDesktop = useIsMobile();

  if (!isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new Plan</DialogTitle>
            <DialogDescription>
              Add your new trading plan here. Click add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Add new Plan</DrawerTitle>
            <DrawerDescription>
              Add your new trading plan here. Click add when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="px-4" onOpenChange={onOpenChange} />
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
  className?: string;
}) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // platform: "",
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createPlan({ name: values.name });
      mutate("/plan/");
      toast.success("Plan created successfully.");
      onOpenChange(false);
    } catch (err) {
      const error = err as AxiosError;

      const message = error.message || "Failed to create plan.";

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Momentum Short" {...field} />
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
