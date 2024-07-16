"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignUpPage = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      redirect("/");
    }
  }, []);

  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
  });
  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      const res = await axios.post("/api/auth/sign-up", data);
      const { message, token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        toast.success(message || "Successfully signed up");
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 409:
            toast.error("This account allready exist, try login");
            break;
          case 500:
            toast.error("Internal server error");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`mt-2 p-2 w-full border rounded-md`}
              {...form.register("name", { required: "Name is required" })}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
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
            Sign Up
          </button>
        </form>
        <div>
          <p>
            Allready have an account?,{" "}
            <span
              role="button"
              className="text-sky-500 hover:text-sky-600"
              onClick={() => router.push("/sign-in")}
            >
              try LogIn
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
