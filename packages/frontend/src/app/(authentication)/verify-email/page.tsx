"use client";

import { VerifyEmail } from "@/actions/users/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    setStatus("loading");
    const verifyEmail = async () => {
      try {
        await VerifyEmail(token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verifyEmail();
  }, [token, router]);

  let cardContent;
  if (status === "loading") {
    cardContent = (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <svg
            className="mb-2 h-12 w-12 animate-spin text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <CardTitle className="text-center">Verifying your email...</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Please wait while we verify your email.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  } else if (status === "error") {
    cardContent = (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <svg
            className="mb-2 h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01"
            />
          </svg>
          <CardTitle className="text-center">Verification Failed</CardTitle>
          <CardDescription className="text-center text-gray-600">
            There was a problem verifying your email. Please try again or
            contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Link href="/login">
            <Button className="mt-4 w-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  } else if (status === "success") {
    cardContent = (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <svg
            className="mb-2 h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
            />
          </svg>
          <CardTitle className="text-center">Email Verified!</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Your email has been successfully verified. You can now log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Link href="/login">
            <Button className="mt-4 w-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  } else {
    cardContent = (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-center">Awaiting Verification</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Please wait while we process your request.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div
          className={cn(
            "flex flex-col items-center justify-center min-h-[300px] gap-6"
          )}
        >
          {cardContent}
        </div>
      </div>
    </div>
  );
}
