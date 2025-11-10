import { deleteAccount, getAccountById } from "@/actions/accounts/account";
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
import { useAccountUIStore } from "@/stores/account-ui-store";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

// interface DialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }


export default function DeleteAccountDialog() {
  const open = useAccountUIStore((s) => s.deleteOpen);
  const onOpenChange = useAccountUIStore((s) => s.setDeleteOpen);
  const selectedId = useAccountUIStore((s) => s.selectedAccountId);
  const setSelectedId = useAccountUIStore((s) => s.setSelectedAccountId);
  const [accountName, setAccountName] = useState<string>("");
  const [accountNameInput, setAccountNameInput] = useState<string>("");

  const handleDelete = async () => {
    if (accountName === accountNameInput) {
      await deleteAccount(selectedId);
      onOpenChange(false);
      setSelectedId(null);
      mutate("/account/");
      toast.success("Account deleted successfully.");
    } else {
      toast.error("Account name does not match.");
    }
  }

  React.useEffect(() => {
    if (!selectedId) return;
    (async () => {
      const account = await getAccountById(selectedId);
      setAccountName(account.name);
    })();
  }, [selectedId]);

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Confirm the deletion of your account. Click delete when you&apos;re sure.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Account Name
            </Label>
            <Input
              id="name"
              placeholder={accountName}
              className="col-span-3"
              onChange={(e) => setAccountNameInput(e.target.value)}
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
