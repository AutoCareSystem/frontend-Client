import React from "react";
import Layout from "../components/Layout/Layout";
import BookingForm from "../components/Booking/BookingForm";

const BookService: React.FC = () => {
  return (
    <Layout>
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

export default BookService;
