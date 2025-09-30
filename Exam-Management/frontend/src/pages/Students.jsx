import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";

//helper to format Firestore timestamps
const formatTimestamp = (ts) => {
  if (!ts) return "-";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString();
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
  return new Date(ts).toLocaleDateString();
};

const Students = ({ students, setStudents }) => {
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });
  const studentsCollection = collection(db, "users"); // Firestore collection

  //fetch students from Firestore on mount
  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(studentsCollection);
      const studentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email) return;

    try {
      const docRef = await addDoc(studentsCollection, {
        name: newStudent.name,
        email: newStudent.email,
        role: "student",
        createdAt: new Date(),
      });

      setStudents([
        ...students,
        { id: docRef.id, ...newStudent, role: "student", createdAt: new Date() },
      ]);
      setNewStudent({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding student: ", error);
      alert("Failed to add student. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setStudents(students.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting student: ", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Students</h2>

      {/* Add Student Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="px-3 py-2 border rounded w-1/3"
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          className="px-3 py-2 border rounded w-1/3"
        />
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <p className="text-gray-500">No students registered.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Registered</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {formatTimestamp(student.createdAt)}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(student.id)}
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

export default Students;
