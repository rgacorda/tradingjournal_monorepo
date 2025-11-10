import { deletePlan, getPlanById } from "@/actions/plans/plans";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlanUIStore } from "@/stores/plan-ui-store";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function DeletePlanDialog() {
  const open = usePlanUIStore((s) => s.deleteOpen);
  const onOpenChange = usePlanUIStore((s) => s.setDeleteOpen);
  const selectedId = usePlanUIStore((s) => s.selectedPlanId);
  const setSelectedId = usePlanUIStore((s) => s.setSelectedPlanId);
  const [planName, setPlanName] = useState<string>("");
  const [planNameInput, setPlanNameInput] = useState<string>("");

  const handleDelete = async () => {
    if (planName === planNameInput) {
      await deletePlan(selectedId);
      onOpenChange(false);
      setSelectedId(null);
      mutate("/plan/");
      toast.success("Plan deleted successfully.");
    } else {
      toast.error("Plan name does not match.");
    }
  };

  React.useEffect(() => {
    if (!selectedId) return;
    (async () => {
      const plan = await getPlanById(selectedId);
      setPlanName(plan.name);
    })();
  }, [selectedId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Plan</DialogTitle>
          <DialogDescription>
            Confirm the deletion of your plan. Click delete when you&apos;re sure.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Plan Name
            </Label>
            <Input
              id="name"
              placeholder={planName}
              className="col-span-3"
              onChange={(e) => setPlanNameInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDelete}>Delete</Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
