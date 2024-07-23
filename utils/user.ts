import axios from "axios"

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

export const fetchUserServer = async (reqHeaders: Headers) => {
  try {
    const cookies = reqHeaders.get("cookie") || "";
    console.log("test function:", cookies);

    const res = await fetch("http://localhost:3000/api/auth/user", {
      method: "GET",
      headers: {
        "Cookie": cookies,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const { userId, name, email, role } = await res.json();
    return { userId, email, name, role };
  } catch (error) {
    console.log("[ERR_FETCHUSER_SV]", error);
    return null;
  }
};