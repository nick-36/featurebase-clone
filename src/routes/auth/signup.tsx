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
import { UserValidationSignUp } from "@/lib/validation/userValidation";
import { Link } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useSignUp } from "@/hooks/auth";
import { z } from "zod";

type SignUpFormValues = z.infer<typeof UserValidationSignUp>;

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  context: () => ({
    header: {
      showAuthButtons: false,
    },
  }),
});

function SignupPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const signUpNewUser = useSignUp();
  const form = useForm({
    resolver: zodResolver(UserValidationSignUp),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);

    try {
      const { email, password } = values;
      const response = await signUpNewUser.mutateAsync({ email, password });
      if (response.success) {
        toast.success("Signup successful!");
        navigate({ to: "/" });
      } else {
        toast.error(response.error);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
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
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          type="password"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <p className="flex items-center gap-2">
                      <LoaderCircle className="animate-spin" /> Creating
                      Account..
                    </p>
                  ) : (
                    <p>Sign Up</p>
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
