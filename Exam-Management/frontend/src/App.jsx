import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Students from "./pages/Students";
import Exams from "./pages/Exams";
import Applications from "./pages/Applications";
import StudentExamView from "./pages/StudentExamView";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import HallTicket from "./components/HallTicket";

const ExamManagementSystem = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  //track Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const role = firebaseUser.email === "admin@exam.com" ? "admin" : "student";
        const groupId = role === "student" ? "group1" : null;
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
          groupId,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  //fetch Firestore data when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsSnap, examsSnap, applicationsSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "exams")),
          getDocs(collection(db, "applications")),
        ]);

        setStudents(studentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setExams(examsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setApplications(applicationsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderContent = () => {
    if (!user) return null;

    // Admin view
    if (user.role === "admin") {
      switch (activeTab) {
        case "students":
          return <Students students={students} setStudents={setStudents} />;
        case "exams":
          return <Exams exams={exams} setExams={setExams} />;
        case "applications":
          return <Applications applications={applications} setApplications={setApplications} />;
        default:
          return <Dashboard students={students} exams={exams} applications={applications} user={user} />;
      }
    }

    //student view
    if (user.role === "student") {
      switch (activeTab) {
        case "exams":
          return (
            <StudentExamView
              user={user}
              exams={exams}
              applications={applications}
              setApplications={setApplications}
            />
          );

        case "hall ticket": {
          if (applications.length === 0) {
            return <p>No applications found for hall ticket.</p>;
          }

          const currentApplication = applications[0]; // Use first application for simplicity

          return (
            <HallTicket
              studentName={user.displayName || "Unnamed Student"}
              studentEmail={user.email || "No Email"}
              examId={currentApplication.examId}
              role="student"
            />
          );
        }

        default:
          return <Dashboard students={students} exams={exams} applications={applications} user={user} />;
      }
    }

    return null;
  };

  if (!user) {
    return (
      <Login
        setUser={setUser}
        setActiveTab={setActiveTab}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setUser={setUser}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
};

export default ExamManagementSystem;
