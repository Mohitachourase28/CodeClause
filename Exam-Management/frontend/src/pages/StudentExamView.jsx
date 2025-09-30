import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import HallTicket from "../components/HallTicket";

const StudentExamView = ({ user, exams, applications, setApplications }) => {
  const [loadingExamId, setLoadingExamId] = useState(null);

  const applyForExam = async (exam) => {
    if (!user) return;

    setLoadingExamId(exam.id);

    try {
      const q = query(
        collection(db, "applications"),
        where("userId", "==", user.uid),
        where("examId", "==", exam.id)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        toast.error("You have already applied for this exam.");
        return;
      }

      const newApp = {
        userId: user.uid,
        examId: exam.id,
        status: "pending",
        submittedAt: new Date().toISOString(),
        studentName: user.displayName || user.email || "Unnamed",
        examTitle: exam.title || "Untitled Exam",
      };

      const docRef = await addDoc(collection(db, "applications"), newApp);

      setApplications([...applications, { id: docRef.id, ...newApp }]);

      toast.success("Exam application submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply for exam.");
    } finally {
      setLoadingExamId(null);
    }
  };

  //filter exams based on group
  const availableExams = exams.filter((exam) => exam.groupId === user.groupId);

  //helper: find student's application for an exam
  const getApplicationForExam = (examId) =>
    applications.find((app) => app.examId === examId && app.userId === user.uid);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-bold text-gray-800 mb-4">Available Exams</h2>

      {availableExams.length === 0 ? (
        <p className="text-gray-500">No exams available for your group.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Venue</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Apply</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Hall Ticket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {availableExams.map((exam) => {
              const alreadyApplied = applications.some(
                (app) => app.examId === exam.id && app.userId === user.uid
              );

              const application = getApplicationForExam(exam.id);

              return (
                <tr key={exam.id}>
                  <td className="px-4 py-2">{exam.title}</td>
                  <td className="px-4 py-2">
                    {exam.date?.toDate
                      ? exam.date.toDate().toLocaleDateString()
                      : new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{exam.venue}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => applyForExam(exam)}
                      disabled={loadingExamId === exam.id || alreadyApplied}
                      className={`px-4 py-2 rounded text-white ${
                        alreadyApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {loadingExamId === exam.id
                        ? "Applying..."
                        : alreadyApplied
                        ? "Applied"
                        : "Apply"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {application ? (
                      <HallTicket
                        studentName={user.displayName || "Unnamed Student"}
                        studentEmail={user.email || "No Email"}
                        examId={exam.id}
                        role="student"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentExamView;
