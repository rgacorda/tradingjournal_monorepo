"use client"
import { TrendingUp } from "lucide-react"

import { RegisterForm } from "./_components/register-form"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">

            <div className="relative hidden bg-muted lg:block">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"></div>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium text-xl font-medium text-gray-900">
                        <TrendingUp className="h-8 w-8 text-gray-900" />
                        Trade2Learn
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
