"use client";

import { Suspense } from "react";
import Loginss from "./_components/LoginPage";

export default function LoginPage() {


  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 border-b-2 border-gray-900 animate-spin"></div>
      </div>
    }>
      <Loginss />
    </Suspense>
  );
}
