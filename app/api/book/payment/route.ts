import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(
  req: Request
) {
  try {
    const midtransClient = require("midtrans-client")
    const orderData = await req.json();
    const { checkin, checkout, propertyId, roomId } = orderData;
    const findRoom = await db.roomTypes.findUnique({
      where: {
        id: roomId
      }
    });
    if (!findRoom) {
      return NextResponse.json({ message: "Invalid room" }, { status: 404 })
    };
    const roomPrice = findRoom?.price ? findRoom.price.toString() : "0";
    
    const differenceInTime =
    checkin && checkout ? checkout.getTime() - checkin.getTime() : null;
    const differenceInDays = differenceInTime
      ? differenceInTime / (1000 * 3600 * 24)
      : null;
    const totalCost = differenceInDays
    ? parseFloat(roomPrice) * differenceInDays
    : null;

    const generateOrderId = uuidv4();

    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction : false,
      serverKey : process.env.MIDTRANS_SERVER_KEY
    });

    let parameter = {
      "transaction_details": {
          "order_id": generateOrderId,
          "gross_amount": totalCost
      },
      "credit_card":{
          "secure" : true
      },
      "customer_details": {
          "first_name": orderData.firstName,
          "last_name": orderData.lastName,
          "email": orderData.email,
          "phone": orderData.phoneNumber
      }
    };

    const transaction = await snap.createTransaction(parameter);
    const response = NextResponse.json({ message: "Success", transaction }, { status: 200 })
    return response;
  } catch (error) {
    console.log("[ERR_PAYMENT_SERVER]", error);
    throw new Error("Internal server error")
  }
}