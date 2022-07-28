import { object, string, TypeOf } from "zod";

export const registerUserSchema = {
  body: object({
    username: string({
      required_error: "Username is required",
    }),

    email: string({
      required_error: "email is required",
    }).email("Must be a valid email"),

    password: string({
      required_error: "password is required",
    })
      .min(6, "Password must be atleast 6 characters long")
      .max(64, "Password should not be longer than 64 characters"),

    confirmPassword: string({
      required_error: "confirm password is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};


export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>