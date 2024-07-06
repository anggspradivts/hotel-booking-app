"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { user } from "@/lib/user";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignInPage = () => {
  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, []);

  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      const res = await axios.post("/api/auth/sign-in", data);
      const { token, name } = res.data;
      if (token) {
        localStorage.setItem("token", token)
        toast.success("Successfully signed in");
        router.push("/");
      }
    } catch (error: any) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 405:
            toast.error("Account not found");
            break;
          case 401:
            toast.error("password or email invalid");
            break;
          default:
            toast.error("Something goes wrong when sign in");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`mt-2 p-2 w-full border rounded-md`}
              {...form.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`mt-2 p-2 w-full border rounded-md`}
              {...form.register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {form.formState.errors.password && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <p>
            Dont have any account?,{" "}
            <span
              role="button"
              className="p-1 text-sky-500 hover:text-sky-600 border-b border-sky-500"
              onClick={() => router.push("/sign-up")}
            >
              register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
