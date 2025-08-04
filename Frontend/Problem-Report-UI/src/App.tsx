import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import ReportList from "./components/ReportList";
import { confirmDialog } from "./components/ConfirmDialog";
import type { Report } from "./components/ReportList";
import type { ReportFormData } from "./components/Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage.tsx";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";
import Frontpage from "./components/Frontpage.tsx";

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [modified, setModified] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");

        const reportsData = response.data.data || response.data;
        
        const mappedReports: Report[] = reportsData.map((r: any) => ({
          id: r.id,
          subsystem: r.subsystem,
          text: r.text,
          imagePath: r.image_path,
          imageType: r.image_type,
          date: r.date,
          status: r.status,
          creatorId: r.creator_id,
          name: r.name ?? "Ismeretlen felhasználó",
        }));

        setReports(mappedReports);
        console.log("Fetched reports:", mappedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        if ((error as any).response?.status === 403) {
          setHasAccess(false);
        }
      }
    };
    fetchReports();
    setModified(false);
  }, [modified, navigate]);

  // Delete reports from the database

  const deleteReport = async (report: Report) => {
    const confirmed = await confirmDialog({
      title: "Bejelentés törlése",
      message:
        "Biztosan törölni szeretnéd ezt a bejelentést? Ez a művelet nem visszavonható.",
    });

    if (!confirmed) return;

    setReports((prev) => prev.filter((r) => r.id !== report.id));
    await api.delete(`/reports/${report.id}`);
  };

  // Toggle report status

  const toggleStatus = async (report: Report) => {
    const updatedStatus = report.status === "lezárt" ? "nyitott" : "lezárt";

    try {
      await api.put(`/reports/${report.id}`, {
        text: report.text,
        subsystem: report.subsystem,
        status: updatedStatus,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: updatedStatus } : r,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Create new report

  const createReport = async (reportData: ReportFormData) => {
    try {
      await api.post(
        "/reports",
        {
          text: reportData.text,
          subsystem: reportData.subsystem,
          status: "nyitott",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setModified(true);
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route
          path="/form"
          element={<Form onCreate={(data) => createReport(data)} />}
        />
        <Route
          path="/reports"
          element={
            <ReportList
              reports={reports}
              onDelete={deleteReport}
              onToggleStatus={toggleStatus}
              access={hasAccess}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
