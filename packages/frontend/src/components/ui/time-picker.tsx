"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState("09");
  const [minutes, setMinutes] = React.useState("30");

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h || "09");
      setMinutes(m || "30");
    }
  }, [value]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const timeString = `${newHours.padStart(2, "0")}:${newMinutes.padStart(2, "0")}`;
    onChange?.(timeString);
  };

  const handleHourChange = (h: string) => {
    setHours(h);
    handleTimeChange(h, minutes);
  };

  const handleMinuteChange = (m: string) => {
    setMinutes(m);
    handleTimeChange(hours, m);
  };

  const displayTime = value || "09:30";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Hour</label>
            <select
              value={hours}
              onChange={(e) => handleHourChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0");
                return (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-center pt-6 text-2xl font-bold">:</div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Minute</label>
            <select
              value={minutes}
              onChange={(e) => handleMinuteChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Array.from({ length: 60 }, (_, i) => {
                const minute = i.toString().padStart(2, "0");
                return (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
