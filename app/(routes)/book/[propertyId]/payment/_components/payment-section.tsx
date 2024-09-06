"use client"
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PaymentSectionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return <div>
      payment not found
    </div>
  }

  // useEffect(() => {
  //   // You can also change below url value to any script url you wish to load, 
  //   // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
  //   const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';  
  
  //   let scriptTag = document.createElement('script');
  //   scriptTag.src = midtransScriptUrl;
  
  //   // Optional: set script attribute, for example snap.js have data-client-key attribute 
  //   // (change the value according to your client-key)
  //   const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY || "";
  //   scriptTag.setAttribute('data-client-key', myMidtransClientKey);
  
  //   document.body.appendChild(scriptTag);
  
  //   return () => {
  //     document.body.removeChild(scriptTag);
  //   }
  // }, []);

  const handlePay = async () => {
    try {
      const res = await axios.post("/api/book/payment", {
        orderId: orderId
      });
      if (res.status === 200) {
        toast.success("Redirecting...");
        router.push(res.data.transaction.redirect_url)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  return (
    <div className="p-4 border border-indigo-100 rounded">
      hallo
      <button onClick={handlePay}>Pay</button>
      <div id="snap-container"></div>
    </div>
   );
}
 
export default PaymentSectionPage;