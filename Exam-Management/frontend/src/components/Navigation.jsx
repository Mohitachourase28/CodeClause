import React from "react";
import { FileText, LogOut, Calendar, Users, CheckCircle } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Navigation = ({ user, activeTab, setActiveTab, setUser }) => {
  const isAdmin = user?.role === "admin";

  const adminTabs = [
    { id: "dashboard", label: "Dashboard", icon: Calendar },
    { id: "students", label: "Students", icon: Users },
    { id: "exams", label: "Exams", icon: FileText },
    { id: "applications", label: "Applications", icon: CheckCircle },
  ];

  const studentTabs = [
    { id: "dashboard", label: "Dashboard", icon: Calendar },
    { id: "exams", label: "Exams", icon: FileText },
  ];

  const tabs = isAdmin ? adminTabs : studentTabs;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Exam Management</h1>
          </div>
          <div className="flex items-center gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
