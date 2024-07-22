import axios from "axios"
import { NextRequest } from "next/server";

export const fetchUser = async () => {
  try {
    const res = await axios.get("/api/auth/user");
    const { userId, email, name, role, message } = res.data;
    return { userId, email, name, role, message };
  } catch (error) {
    console.log("[ERR_FETCH_USER]", error);
    return { userId: null, email: null, name: null, role: null }
  }
}

export const fetchUserServer = async (req: NextRequest) => {
  try {
    const cookies = req.headers.get("cookie") || ""
    const res = await fetch("http://localhost:3000/api/auth/user", {
      method: "GET",
      headers: {
        "Cookie": cookies
      }
    });

    const { userId, name, email, role } = await res.json()
  } catch (error) {
    console.log("[ERR_FETCHUSER_SV]", error);
    
  }
}