import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformInput } from "./platform_input";
import { useState } from "react";
import { toast } from "sonner";
import { ImportTradesService } from "@/actions/trades/import_trades";
import { mutate } from "swr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AccountInput } from "./account_input";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportTrade({ open, onOpenChange }: DialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  // const [openCalendar, setOpenCalendar] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValidType =
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv") ||
        selectedFile.name.endsWith(".xls");

      if (!isValidType) {
        toast.error("Only CSV or Excel (.xls) files are allowed.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !platform || !account || !date) {
      toast.error("Incomplete Upload Details.");
      return;
    } else {
      try {
        await ImportTradesService.importTrades({
          platform,
          file,
          account,
          date,
        });
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          (error as { status?: number }).status === 403
        ) {
          toast("Subscribe to use this feature.", {
            action: {
              label: "Subscribe",
              onClick: () => console.log("subscribe"),
            },
          });
        } else {
          toast.error("Failed to upload file.");
        }
        return;
      }
      toast.success("File uploaded successfully.");
      mutate("/trade/");
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Trades</DialogTitle>
          <DialogDescription>
            Select Platform first before importing trades.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-full justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      // setOpenCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Platform
            </Label>
            <div className="col-span-3">
              <PlatformInput value={platform} setValue={setPlatform} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Account
            </Label>
            <div className="col-span-3">
              <AccountInput value={account} setValue={setAccount} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Upload File
            </Label>
            <Input
              id="picture"
              type="file"
              accept=".csv,.xls"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
