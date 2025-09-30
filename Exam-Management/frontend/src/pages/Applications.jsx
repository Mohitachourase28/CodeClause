import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";

//helper to format Firestore timestamps
const formatTimestamp = (ts) => {
  if (!ts) return "-";
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
  return new Date(ts).toLocaleString();
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndFixApplications() {
      try {
        const appsSnap = await getDocs(collection(db, "applications"));
        const appsData = [];

        // Loop through each application
        for (const appDoc of appsSnap.docs) {
          const app = appDoc.data();
          const updates = {};

          // Fix studentName
          if (!app.studentName && app.userId) {
            try {
              const userSnap = await getDoc(doc(db, "users", app.userId));
              if (userSnap.exists()) {
                const user = userSnap.data();
                updates.studentName = user.name || user.email || "Unnamed";
              } else {
                updates.studentName = "Unnamed";
              }
            } catch (err) {
              console.error("Error fetching user:", err);
              updates.studentName = "Unnamed";
            }
          }

          // Fix examTitle
          if (!app.examTitle && app.examId) {
            try {
              const examSnap = await getDoc(doc(db, "exams", app.examId));
              if (examSnap.exists()) {
                const exam = examSnap.data();
                updates.examTitle = exam.title || "Untitled Exam";
              } else {
                updates.examTitle = "Untitled Exam";
              }
            } catch (err) {
              console.error("Error fetching exam:", err);
              updates.examTitle = "Untitled Exam";
            }
          }

          // Apply updates to Firestore if needed
          if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, "applications", appDoc.id), updates);
            Object.assign(app, updates); // Apply updates locally
          }

          appsData.push({ id: appDoc.id, ...app });
        }

        setApplications(appsData);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndFixApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      await updateDoc(doc(db, "applications", id), { status });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Exam Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Student
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Exam
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Submitted
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="px-4 py-2">{app.studentName || "Unknown Student"}</td>
                <td className="px-4 py-2">{app.examTitle || "Unknown Exam"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {formatTimestamp(app.submittedAt)}
                </td>
                <td className="px-4 py-2">
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(app.id, "approved")}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Applications;
