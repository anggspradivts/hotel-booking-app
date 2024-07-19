"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignInPage = () => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      const res = await axios.post("/api/auth/sign-in", data);
      if (res.status === 200) {
        const { message } = res.data;
        console.log(message);
        toast.success(message);
        window.location.href = "/";
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        setIsError(true);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={clsx("bg-white p-8 rounded-lg shadow-lg w-full max-w-md", {
          "shadow-red-500 shadow-md": isError === true,
        })}
      >
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
              className="p-1 text-sky-500 hover:text-sky-600"
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
