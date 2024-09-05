"use client"
import { useSearchParams } from "next/navigation";

const PaymentSectionPage = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) {
    return <div>
      payment not found
    </div>
  }
  return ( 
    <div className="p-4 border border-indigo-100 rounded">
      hallo
    </div>
   );
}
 
export default PaymentSectionPage;