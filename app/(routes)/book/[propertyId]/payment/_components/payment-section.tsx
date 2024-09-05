"use client"
import { useSearchParams } from "next/navigation";

const PaymentSectionPage = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  
  return ( 
    <div>
      Halo
    </div>
   );
}
 
export default PaymentSectionPage;