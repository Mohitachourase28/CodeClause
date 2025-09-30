import React from "react";

const Dashboard = ({ students, exams, applications, user }) => {
  const isAdmin = user?.role === "admin";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Students */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Students</h2>
        <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
        {isAdmin && <p className="text-sm text-gray-500 mt-1">Total Registered</p>}
      </div>

      {/* Exams */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Exams</h2>
        <p className="text-3xl font-bold text-indigo-600">{exams.length}</p>
        <p className="text-sm text-gray-500 mt-1">Scheduled</p>
      </div>

      {/* Applications */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Applications</h2>
        <p className="text-3xl font-bold text-indigo-600">{applications.length}</p>
        <p className="text-sm text-gray-500 mt-1">Submitted</p>
      </div>
    </div>
  );
};

export default Dashboard;
