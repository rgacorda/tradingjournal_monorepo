import { deletePlan } from "@/actions/plans/plans";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { mutate } from "swr";

interface PlansCardProps {
  id: string;
  image: string | null;
  title: string;
  subtext: string | null;
}
export default function PlansCard(props: PlansCardProps) {
  const handleDelete = async () => {
    try {
      await deletePlan(props.id);
      mutate("/plan/");
      toast.success("Plan deleted successfully.");
    } catch (error) {
      const axiosError = error as AxiosError;

      const message =
        axiosError.message ||
        "Failed to delete plan.";

      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div>
        {props?.image ? (
          <Image
            src={props.image}
            className="w-full h-56 object-cover"
            alt="Plan Image"
            width={500}
            height={500}
          />
        ) : (
          <Skeleton className="h-[225px] rounded-xl mx-4" />
        )}
      </div>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.subtext ?? "No subtext"}</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
