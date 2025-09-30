import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

// Helper to format Firestore timestamps
const formatTimestamp = (ts) => {
  if (!ts) return "-";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString();
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
  return new Date(ts).toLocaleDateString();
};

const Exams = ({ exams, setExams }) => {
  const [newExam, setNewExam] = useState({ title: "", date: "", venue: "", groupId: "" });
  const examsCollection = collection(db, "exams");

  const handleAddExam = async (e) => {
    e.preventDefault();
    if (!newExam.title || !newExam.date || !newExam.venue || !newExam.groupId) return;

    try {
      const docRef = await addDoc(examsCollection, {
        ...newExam,
        date: new Date(newExam.date), // store as Date object
      });
      setExams([...exams, { id: docRef.id, ...newExam, date: new Date(newExam.date) }]);
      setNewExam({ title: "", date: "", venue: "", groupId: "" });
    } catch (error) {
      console.error("Error adding exam:", error);
      alert("Failed to add exam. Please try again.");
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await deleteDoc(doc(db, "exams", id));
      setExams(exams.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Exams</h2>

      <form onSubmit={handleAddExam} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newExam.title}
          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="date"
          value={newExam.date}
          onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Venue"
          value={newExam.venue}
          onChange={(e) => setNewExam({ ...newExam, venue: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Group ID"
          value={newExam.groupId}
          onChange={(e) => setNewExam({ ...newExam, groupId: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <button className="col-span-full md:col-span-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Exam
        </button>
      </form>

      {exams.length === 0 ? (
        <p className="text-gray-500">No exams scheduled.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Venue</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Group ID</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-2">{e.title}</td>
                <td className="px-4 py-2">{formatTimestamp(e.date)}</td>
                <td className="px-4 py-2">{e.venue}</td>
                <td className="px-4 py-2">{e.groupId}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteExam(e.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Exams;
