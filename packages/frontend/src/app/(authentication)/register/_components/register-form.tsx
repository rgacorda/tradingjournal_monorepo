"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Register } from "@/actions/users/auth";
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
import { AxiosError } from "axios";
import React from "react";
import Link from "next/link";

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email(),
  // phone: z.string().min(2, {
  //   message: "Phone number must be at least 2 characters.",
  // }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      {
        message:
          "Password must contain at least 1 capital letter, 1 number, and 1 symbol.",
      }
    ),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      // phone: "",
      password: "",
    },
  });

  const router = useRouter();

  const [show, setShow] = React.useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await Register(values);
      toast.success("Registered successfully");
      router.push("/login");
    } catch (err: unknown) {
      let message = (err as Error).message || "Registration failed";

      if (typeof err === "object" && err !== null && "isAxiosError" in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        message = axiosErr.response?.data?.message || message;

        if (message === "Email already exists.") {
          toast.error(message);
          console.log(axiosErr);
          return;
        }
      }

      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Fill up your details to Register your account
          </p>
        </div>
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+63" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="password"
                      {...field}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                      onClick={() => setShow((s) => !s)}
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
      <div className="text-center text-sm py-2">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </Form>
    //   <div className="flex flex-col items-center gap-2 text-center">
    //     <h1 className="text-2xl font-bold">Register your account</h1>
    //     <p className="text-balance text-sm text-muted-foreground">
    //       Fill up your details to Register your account
    //     </p>
    //   </div>
    //   <div className="grid gap-3">
    //     <div className="grid">
    //       <Input id="firstname" type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
    //     </div>
    //     <div className="grid">
    //       <Input id="lastname" type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
    //     </div>
    //     <div className="grid">
    //       <Input id="phone" type="text" placeholder="Phone" value={phone} onChange={(e) => setPhoneNumber(e.target.value)} required />
    //     </div>
    //     <div className="grid">
    //       <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    //     </div>
    //     <div className="grid">
    //       <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    //     </div>
    //     <Button type="submit" className="w-full">
    //       Register
    //     </Button>
    //     <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
    //       <span className="relative z-10 bg-background px-2 text-muted-foreground">
    //         Or continue with
    //       </span>
    //     </div>
    //     <Button variant="outline" className="w-full">
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //         <path
    //           d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    //           fill="currentColor"
    //         />
    //       </svg>
    //       Google
    //     </Button>
    //   </div>
    //   <div className="text-center text-sm">
    //     Already have an account?{" "}
    //     <Link href="/login" className="underline underline-offset-4">
    //       Sign in
    //     </Link>
    //   </div>
    // </form>
  );
}
