"use client";

import UserAvatar from "@/components/user-avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();

  return (
    <div>
      <UserAvatar />

      <button
        className="bg-red-500 text-white p-1 rounded-xl"
        onClick={() => {
          const removeToken = localStorage.removeItem("token");
          
          window.location.reload();
          console.log("refresh")
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
