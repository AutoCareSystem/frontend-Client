import React from "react";
import Layout from "../../components/Layout/Layout";
import Dashboard from "../../components/Dashboard/Dashboard";

const DashboardDev: React.FC = () => {
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
      <Dashboard />
    </Layout>
  );
};

export default DashboardDev;
