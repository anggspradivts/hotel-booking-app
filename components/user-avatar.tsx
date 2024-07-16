import { isTokenExpired } from "@/utils/token-validity";
import axios from "axios";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserAvatar = () => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const tokenExpired = isTokenExpired(token);
        if (tokenExpired) return localStorage.removeItem("token");

        const res = await axios.get("/api/auth/user");
        const { email, name } = res.data;

        setEmail(email);
        setName(name);
        
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Token is expired or invalid
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token"); // Remove invalid token
          router.push("/login"); // Redirect to login page
        } else {
          throw new Error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [email, name]);

  return (
    <div className="">
      {name ? (
        <div className="">
          <span className="px-3 p-1 rounded-full bg-sky-500">{name.charAt(0)}</span>
          <span>email:{email}</span>
        </div>
      ) : (
        <div className="space-x-3">
          <button onClick={() => router.push("sign-in")} className="bg-slate-200 p-2 rounded">SignIn</button>
          <button onClick={() => router.push("sign-up")} className="bg-slate-200 p-2 rounded">SignUp</button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
