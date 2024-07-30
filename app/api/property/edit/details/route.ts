export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    console.log("testt", data)
  } catch (error) {
    console.log("[ERR_CREATE_DETAILS]", error);
    throw new Error("Internal server error")
  }
}