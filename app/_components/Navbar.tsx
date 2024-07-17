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

      
    </div>
  );
};

export default Navbar;
