import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/validation/userValidation";
import { Link } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useSignIn } from "@/hooks/auth";
import { z } from "zod";

type SignInFormValues = z.infer<typeof SignInSchema>;
export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  context: () => ({
    header: {
      showAuthButtons: false,
    },
  }),
});

function LoginPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const signInUser = useSignIn();

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      const response = await signInUser.mutateAsync({ email, password });
      if (response?.error) {
        toast.error(response?.error);
      } else {
        toast.success("Logged in successfully!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error("error", err.errors[0].longMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Email (e.g.,name@example.com)"
                            className="placeholder:text-gray-300 placeholder:font-light"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              placeholder="******"
                              type="password"
                              autoCapitalize="none"
                              autoComplete="email"
                              autoCorrect="off"
                              className="placeholder:text-gray-300 placeholder:font-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <p className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin" /> Logging in..
                      </p>
                    ) : (
                      <p>Login</p>
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
