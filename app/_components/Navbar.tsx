"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { email, name } = res.data;
        setEmail(email);
        setName(name)
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchUser();
  }, []);
  return <div>
    {name}
    {email}
  </div>;
};

export default Navbar;
