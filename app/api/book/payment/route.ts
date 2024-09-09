import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(
  req: Request
) {
  try {
    const orderData = await req.json();
    const { checkin, checkout, propertyId, roomId } = orderData;
    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });
    const findRoom = await db.roomTypes.findUnique({
      where: {
        id: roomId
      }
    });
    if (!findRoom || !findProperty) {
      return NextResponse.json({ message: "Invalid room or property" }, { status: 404 })
    };
    const roomPrice = findRoom?.price ? findRoom.price.toString() : "0";
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const differenceInTime = checkoutDate.getTime() - checkinDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const totalCost = parseFloat(roomPrice) * differenceInDays;

    const generateOrderId = uuidv4();
    const midtransClient = require("midtrans-client")

    // let snap = new midtransClient.Snap({
    //   // Set to true if you want Production Environment (accept real transaction).
    //   isProduction : false,
    //   serverKey : process.env.MIDTRANS_SERVER_KEY,
    // });
    let core = new midtransClient.CoreApi({
      isProduction : false,
      serverKey : process.env.MIDTRANS_SERVER_KEY,
      clientKey : process.env.MIDTRANS_CLIENT_KEY
    });

    // let parameter = {
    //   "transaction_details": {
    //       "order_id": generateOrderId,
    //       "gross_amount": totalCost
    //   },
    //   "credit_card":{
    //       "secure" : true
    //   },
    //   "property_details": {
    //     "id": propertyId,
    //     "property_name": findProperty.name
    //   },
    //   "customer_details": {
    //       "first_name": orderData.firstName,
    //       "last_name": orderData.lastName,
    //       "email": orderData.email,
    //       "phone": orderData.phoneNumber
    //   }
    // };

    let parameter = {
      "payment_type": "gopay",
      "transaction_details": {
          "gross_amount": totalCost,
          "order_id": generateOrderId,
      },
      "gopay": {
          "enable_callback": true,                // optional
          "callback_url": "someapps://callback"   // optional
      }
    }
  
    const transaction = await core.createTransaction(parameter);
    console.log("transs", transaction);
    // const response = NextResponse.json({ message: "Success", transaction }, { status: 200 })
    // return response;
  } catch (error) {
    console.log("[ERR_PAYMENT_SERVER]", error);
    throw new Error("Internal server error")
  }
}