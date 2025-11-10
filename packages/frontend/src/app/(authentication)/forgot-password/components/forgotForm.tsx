"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ForgotPassword } from "@/actions/users/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
});

export function ForgotForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [success, setSuccess] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;
    try {
      await ForgotPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to send reset link:", error);
    }
  };

  if (success) {
    return <ResetSuccessForm />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset account password</CardTitle>
          <CardDescription>
            Enter your email below to send reset link to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("flex flex-col gap-6", className)}
            >
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Loading..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function ResetSuccessForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[300px] gap-6", className)} {...props}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <svg
            className="mb-2 h-12 w-12 text-black-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
            />
          </svg>
          <CardTitle className="text-center">
            Password Reset Link Sent!
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Please check your email for the password reset link.<br />
            If you don&apos;t see it, check your spam folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Link href="/login">
            <Button className="mt-4 w-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
