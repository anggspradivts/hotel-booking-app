"use client";
import { fetchUser } from "@/utils/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PartnerLandingPage = () => {
  const [isPartner, setIsPartner] = useState(false);
  const router = useRouter();

  if (isPartner) {
    router.push("/partner/my-property")
  }

  useEffect(() => {
    const getUser = async () => {
      const { role } = await fetchUser();
      if (role === "PARTNER") {
        setIsPartner(true);
      }
    };
    getUser();
  }, []);

  const handleClick = async () => {
    try {
      const res = await axios.post("/api/partner-register");
      router.push("/partner/list-property");
      toast.success(res.data.message);
      setIsPartner(true);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const statusResponse = error.response.status;
        console.log(statusResponse);
        switch (statusResponse) {
          case 401:
            toast.error("Try sign in or login first");
            router.push("/sign-in");
        }
      }
    }
  };

  return (
    <div className="md:px-28">
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Hero Section */}
        <header className="bg-indigo-500 text-white py-16 text-center">
          <h1 className="text-4xl font-bold">Become Our Partner</h1>
          <p className="mt-4 text-lg">
            Join us in our mission to provide excellent service and grow
            together!
          </p>
          {isPartner ? (
            <div className="space-x-5">
              
              <button
                onClick={() => router.push("/partner/my-property")}
                className="mt-8 inline-block bg-white text-indigo-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100"
              >
                my property
              </button>
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="mt-8 inline-block bg-white text-indigo-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100"
            >
              Get started
            </button>
          )}
        </header>

        {/* Why Partner with Us Section */}
        <section className="py-16 px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Partner with Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                  Maximize Your Property's Potential
                </h3>
                <p className="text-gray-600">
                  We connect your property with a global audience actively
                  searching for unique, high-quality accommodations.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                  Simplified Management
                </h3>
                <p className="text-gray-600">
                  Save time with our easy-to-use tools that let you stay in
                  control of your property while we handle the technicalities.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Marketing Expertise</h3>
                <p className="text-gray-600">
                  We use targeted campaigns and tailored strategies to drive
                  more traffic and bookings, ensuring your property stands out
                  from the crowd.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">What Our Partners Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600">
                  "Working with this company has been a fantastic experience!
                  They helped us grow beyond our expectations."
                </p>
                <h4 className="mt-4 font-bold">— Partner A</h4>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600">
                  "Their network and support have been invaluable in boosting
                  our sales and expanding our reach."
                </p>
                <h4 className="mt-4 font-bold">— Partner B</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        {!isPartner &&
          <section
            id="contact"
            className="py-16 px-8 bg-indigo-500 text-white text-center"
          >
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Partner with Us?
              </h2>
              <p className="mb-6">
                Fill out the form below, and our team will get back to you
                shortly.
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded-md focus:outline-none text-black"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 rounded-md focus:outline-none text-black"
                />
                <textarea
                  placeholder="Tell us about your business"
                  className="w-full px-4 py-2 rounded-md focus:outline-none text-black"
                  // rows="4"
                ></textarea>
                <button
                  type="submit"
                  className="bg-white text-indigo-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100"
                >
                  Submit
                </button>
              </form>
            </div>
          </section>
        }

        {/* Footer */}
        {/* <footer className="bg-gray-800 text-white py-8 text-center">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer> */}
      </div>
    </div>
  );
};

export default PartnerLandingPage;
