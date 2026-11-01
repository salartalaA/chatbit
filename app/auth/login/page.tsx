"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Coffee, Eye, EyeOff, Loader2, Lock, Mail, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { type LoginFormValues, loginSchema } from "@/schemas/auth.schema";

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (user: LoginFormValues) => {
    try {
      const { error } = await signIn.email({
        email: user.email,
        password: user.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Unable to sign in. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center">
      <div className="bg-card flex min-h-screen w-full max-w-1/2 flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-background w-fit rounded-md p-2">
            <Radio size={16} />
          </div>
          <span className="font-semibold">Chatbit</span>
        </div>

        <div className="relative m-auto flex aspect-3/4 w-full max-w-md items-center justify-center">
          <Image
            alt="Login Image"
            className="rounded-md object-cover"
            fill
            src="/login-pic.jpg"
          />

          <div className="absolute inset-0 flex flex-col justify-end rounded-b-md bg-linear-to-t from-black/75 via-black/20 to-transparent p-6 text-white">
            <p className="font-mono text-xs tracking-wider text-white/70 uppercase">
              Archive · Room 04
            </p>
            <p className="mt-1 text-sm leading-snug font-medium text-white/95">
              Analog turntable routing, tube amplification, and shared
              acoustics.
            </p>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <p>Spend time with your friends</p>
          <span>v0</span>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center gap-4">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-3xl font-bold">Login</h3>
            <p className="text-muted-foreground flex items-center gap-0.5 text-sm">
              Hope you have good times with your friends! <Coffee size={18} />
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs" htmlFor="email">
                Email
              </Label>

              <div className="relative flex items-center">
                <Input
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  className="bg-card placeholder:text-muted-foreground/75 border-0 ps-8 focus:border"
                  id="email"
                  placeholder="john@gmail.com"
                  type="email"
                />

                <Mail
                  className="text-muted-foreground absolute ms-2"
                  size={16}
                />
              </div>

              {errors.email && (
                <p className="text-destructive text-xs" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs" htmlFor="password">
                Password
              </Label>

              <div className="relative flex items-center">
                <Input
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                  className="bg-card placeholder:text-muted-foreground/75 border-0 ps-8 focus:border"
                  id="password"
                  placeholder="••••••••"
                  type={isPasswordVisible ? "text" : "password"}
                />

                <Lock
                  className="text-muted-foreground absolute ms-2"
                  size={16}
                />

                <button
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  className="text-muted-foreground absolute inset-e-2"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  type="button"
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-destructive text-xs" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>

        <div className="-mb-10 text-center text-xs">
          <p className="text-muted-foreground">
            Need a fresh identity?{" "}
            <Link className="text-primary" href="/auth/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
