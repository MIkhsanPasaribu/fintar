"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User, Mail, Lock } from "lucide-react";

const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");

    try {
      // You'll need to implement this API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      router.push("/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-main to-bg-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link
            href="/landing"
            className="inline-flex items-center space-x-2 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center neon-glow group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-3xl font-bold gradient-text">Fintar</span>
          </Link>
          <p className="mt-4 text-font-secondary">
            Buat akun baru untuk mulai mengelola keuangan Anda dengan cerdas
          </p>
        </div>

        {/* Register Form */}
        <Card className="glass-effect border-secondary-400/20">
          <CardHeader>
            <CardTitle className="text-font-light text-2xl text-center">
              Buat Akun Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-4 bg-error/10 border border-error/30"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-font-light">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          disabled={isLoading}
                          icon={<User className="h-4 w-4" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-font-light">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={isLoading}
                          icon={<Mail className="h-4 w-4" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-font-light">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          icon={<Lock className="h-4 w-4" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-font-light">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          icon={<Lock className="h-4 w-4" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-secondary-400 hover:bg-secondary-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-400/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-bg-main text-font-muted"></span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-sm text-font-secondary">
                  Sudah punya akun?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-sm text-accent-400 hover:text-accent-500 hover:underline font-medium transition-colors"
                >
                  Masuk sekarang
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-xs text-font-secondary">
              Dengan mendaftar, Anda menyetujui{" "}
              <Link
                href="/terms"
                className="text-accent-400 hover:text-accent-500 hover:underline"
              >
                Ketentuan Layanan
              </Link>{" "}
              dan{" "}
              <Link
                href="/privacy"
                className="text-accent-400 hover:text-accent-500 hover:underline"
              >
                Kebijakan Privasi
              </Link>{" "}
              kami.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
