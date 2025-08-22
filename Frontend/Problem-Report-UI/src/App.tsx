import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import ReportList from "./components/ReportList";
import { confirmDialog } from "./components/ConfirmDialog";
import type { Report } from "./components/ReportList";
import type { ReportFormData } from "./components/Form";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage.tsx";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";
import Frontpage from "./components/Frontpage.tsx";
import { isLoggedIn, canViewAllReports } from "./utils/auth";
import { useInactivityTimer } from "./hooks/useInactivityTimer";

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [modified, setModified] = useState(false);
  const navigate = useNavigate();
  
  useInactivityTimer();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let endpoint = "/reports";

        if (isLoggedIn()) {
          if (!canViewAllReports()) {
            endpoint = "/my-reports";
          }
        } else {
          endpoint = "/reports";
        }

        const response = await api.get(endpoint);

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

    try {
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      await api.delete(`/reports/${report.id}`);
    } catch (error) {
      console.error("Failed to delete report:", error);
      setModified(true);
      if ((error as any)?.response?.data?.message) {
        alert(`Hiba: ${(error as any).response.data.message}`);
      } else {
        alert("Hiba történt a bejelentés törlése során!");
      }
    }
  };

  // Switch report status

  const toggleStatus = async (report: Report) => {
    let updatedStatus: string;
    
    switch (report.status) {
      case "nyitott":
        updatedStatus = "folyamatban";
        break;
      case "folyamatban":
        updatedStatus = "lezárt";
        break;
      case "lezárt":
        updatedStatus = "nyitott";
        break;
      default:
        updatedStatus = "nyitott";
        break;
    }

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

  // Change report status to specific value

  const changeStatus = async (report: Report, newStatus: string) => {
    try {
      await api.put(`/reports/${report.id}`, {
        text: report.text,
        subsystem: report.subsystem,
        status: newStatus,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: newStatus } : r,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      if ((err as any)?.response?.data?.message) {
        alert(`Hiba: ${(err as any).response.data.message}`);
      } else {
        alert("Hiba történt a státusz frissítése során!");
      }
    }
  };

  // Create new report

  const createReport = async (reportData: ReportFormData) => {
    try {
      if (reportData.image && reportData.image.size > 2 * 1024 * 1024) {
        alert("A kép mérete nem lehet nagyobb 2MB-nál!");
        return;
      }

      if (reportData.image) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(reportData.image.type)) {
          alert("Csak JPG és PNG fájlok engedélyezettek!");
          return;
        }
      }

      const formData = new FormData();
      formData.append("text", reportData.text);
      formData.append("subsystem", reportData.subsystem);
      formData.append("status", "nyitott");

      if (reportData.image) {
        formData.append("image", reportData.image);
      }

      await api.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModified(true);
    } catch (error) {
      console.error("Failed to create report:", error);
      const response = (error as any)?.response;
      
      if (response?.status === 422) {
        // Validation errors
        const errors = response?.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join("\n");
          alert(`Validációs hibák:\n${errorMessages}`);
        } else {
          alert("Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.");
        }
      } else if (response?.status === 401) {
        alert("Nincs jogosultságod bejelentés létrehozásához! Kérjük, jelentkezz be újra.");
      } else if (response?.status === 413) {
        alert("A feltöltött fájl túl nagy! Kérjük, válassz kisebb képet.");
      } else if (response?.status === 415) {
        alert("Nem támogatott fájlformátum! Csak JPG és PNG képeket fogadunk el.");
      } else if (response?.status >= 500) {
        alert("Szerverhiba! Kérjük, próbáld újra később.");
      } else if (response?.data?.message) {
        alert(`Hiba: ${response.data.message}`);
      } else {
        alert("Hiba történt a bejelentés mentése során! Kérjük, próbáld újra.");
      }
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
              onStatusChange={changeStatus}
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
