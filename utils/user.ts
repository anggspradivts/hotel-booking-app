import axios from "axios"

export const fetchUser = async () => {
  try {
    const res = await axios.get("/api/auth/user");
    const { name } = res.data;
    return { name }
  } catch (error) {
    console.log("[ERR_FETCH_USER]", error)
  }
}