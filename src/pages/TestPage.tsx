import React from "react";

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Test Page - Development Mode
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            ✅ This page is working!
          </h2>
          <p className="text-gray-600 mb-4">
            If you can see this page, the development routes are working
            correctly.
          </p>
          <div className="space-y-2">
            <p>
              <strong>Current URL:</strong> {window.location.href}
            </p>
            <p>
              <strong>Current Path:</strong> {window.location.pathname}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
