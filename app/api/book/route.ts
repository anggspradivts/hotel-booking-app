export async function POST(req: Request) {
  try {
    const completeData = await req.json();
    
  } catch (error) {
    console.log("[ERR_POST_USERDETAILS_BOOK]", error);
    throw new Error("Internal server error")
  }
}