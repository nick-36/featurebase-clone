import * as z from "zod";

export const UserValidationSignUp = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" }),

  password: z.string().min(6, {
    message: "Password needs 6 characters.",
  }),
});

export const SignInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must contain atlease 6 character.",
  }),
});
