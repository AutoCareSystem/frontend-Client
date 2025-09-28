import React from "react";
import Layout from "../../components/Layout/Layout";
import BookingForm from "../../components/Booking/BookingForm";

const BookServiceDev: React.FC = () => {
  return (
    <Layout>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-800 font-medium">
          🚧 Development Mode - Authentication Bypassed
        </p>
        <p className="text-yellow-700 text-sm">
          This page bypasses authentication for development purposes.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Book Vehicle Service
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule your vehicle service appointment in just a few simple
            steps.
          </p>
        </div>
        <BookingForm />
      </div>
    </Layout>
  );
};

export default BookServiceDev;
