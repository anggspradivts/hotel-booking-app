import { isTokenExpired } from "@/utils/token-validity";
import axios from "axios";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const handleLogOut =  async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      const { message } = res.data;
      toast.success(message || "Success logged out")
      window.location.reload()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleErrorResponse = (error: any) => {
    if (error.response && error.response.data) {
      const responseStatus = error.response.data.message;
      toast.error(responseStatus)
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      console.log("p")
      try {
        const res = await axios.get("/api/auth/user");
        const { email, name } = res.data;
        setEmail(email);
        setName(name);
      } catch (error) {
        handleErrorResponse(error)
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {name ? (
        <div className="">
          <span
            className="px-3 p-1 rounded-full bg-slate-500 text-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {name.charAt(0)}
          </span>
          {isHovered && (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="absolute flex flex-col bg-white border border-slate-400 p-2 rounded-lg"
            >
              <span>name: {name}</span>
              <span>email:{email}</span>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-x-3">
          <button
            onClick={() => router.push("sign-in")}
            className="bg-slate-200 p-2 rounded"
          >
            SignIn
          </button>
          <button
            onClick={() => router.push("sign-up")}
            className="bg-slate-200 p-2 rounded"
          >
            SignUp
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
