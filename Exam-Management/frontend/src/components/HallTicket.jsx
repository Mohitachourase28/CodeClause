import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import { toast, Toaster } from "react-hot-toast";

//helper to format Firestore timestamps
const formatTimestamp = (ts) => {
  if (!ts) return "-";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString();
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
  return new Date(ts).toLocaleDateString();
};

function HallTicket({ examId, studentName, studentEmail, role }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) {
      setError("Exam ID missing.");
      setLoading(false);
      return;
    }

    async function fetchExam() {
      setLoading(true);
      try {
        const examDoc = await getDoc(doc(db, "exams", examId));
        if (!examDoc.exists()) {
          setError("Exam not found.");
        } else {
          setExam(examDoc.data());
        }
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Failed to load hall ticket details.");
        toast.error("Failed to load hall ticket details.");
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examId]);

  const generatePDF = () => {
    if (!exam) {
      toast.error("Exam details missing!");
      return;
    }

    try {
      const docPDF = new jsPDF();
      docPDF.setFontSize(18);
      docPDF.text("Hall Ticket", 20, 20);

      docPDF.setFontSize(12);
      docPDF.text(`Student Name: ${studentName || "N/A"}`, 20, 40);
      docPDF.text(`Email: ${studentEmail || "N/A"}`, 20, 50);
      docPDF.text(`Exam: ${exam.title || "N/A"}`, 20, 70);
      docPDF.text(`Date: ${formatTimestamp(exam.date)}`, 20, 80);
      docPDF.text(`Venue: ${exam.venue || "N/A"}`, 20, 90);
      docPDF.text("Please bring a valid ID card.", 20, 110);

      docPDF.save("hall_ticket.pdf");
      toast.success("Hall Ticket downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate Hall Ticket.");
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      {loading && <p>Loading exam details...</p>}
      {!loading && error && <p className="text-red-500">{error}</p>}
      {!loading && !error && exam && role === "student" && (
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Hall Ticket
        </button>
      )}
      {!loading && !error && exam && role !== "student" && (
        <p className="text-gray-700">You do not have permission to download this hall ticket.</p>
      )}
    </div>
  );
}

export default HallTicket;
