import { isTokenExpired } from "@/utils/token-validity";
import axios from "axios";
import clsx from "clsx";
import { cookies } from "next/headers";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  const handleLogOut = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      const { message } = res.data;
      toast.success(message || "Success logged out");
      window.location.reload();
      // router.push("/sign-in");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleErrorResponse = (error: any) => {
    if (error.response && error.response.data) {
      const responseStatus = error.response.data.message;
      console.log(responseStatus);
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user");
        const { email, name, role } = res.data;
        setEmail(email);
        setName(name);
        console.log(role);
        if (role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        handleErrorResponse(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [name, email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {name ? (
        <div className="">
          <span
            className={clsx(
              "px-3 p-1 rounded-full bg-slate-500 text-white",
              "hover:bg-slate-400",
              "transition-all duration-100"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {name.charAt(0)}
          </span>
          {isHovered && (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={clsx(
                "bg-white border text-black",
                "right-20 absolute flex flex-col space-y-2 p-2 rounded-lg"
              )}
            >
              <span>name: {name}</span>
              <span>email:{email}</span>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={handleLogOut}
              >
                Logout
              </button>
              {isAdmin ? (
                isAdminPage ? (
                  <button
                    onClick={() => router.push("/")}
                    className="text-center bg-slate-500 text-white p-1 rounded"
                  >
                    Exit Admin Mode
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/admin")}
                    className="text-center bg-slate-500 text-white p-1 rounded"
                  >
                    Admin Mode
                  </button>
                )
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="space-x-3">
          <button
            onClick={() => router.push("/sign-in")}
            className={clsx(
              "bg-slate-200 p-2 rounded text-black",
              "hover:bg-slate-300"
            )}
          >
            SignIn
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className={clsx(
              "bg-slate-200 p-2 rounded text-black",
              "hover:bg-slate-300"
            )}
          >
            SignUp
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
