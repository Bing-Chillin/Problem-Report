import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import axios, { AxiosError } from "axios";
import Form from "./components/Form";
import ReportList from "./components/ReportList";
import { confirmDialog } from "./components/ConfirmDialog";
import type { Report } from "./components/ReportList";
import type { ReportFormData } from "./components/Form";

function App() {
  //fetch reports from the API

  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<Report[]>(
          "http://localhost:5255/Report",
        );
        setReports(response.data);
        console.log("Fetched reports:", response.data);
      } catch (error) {
        console.error(
          "Failed to fetch reports:",
          (error as AxiosError).message,
        );
      }
    };
    fetchReports();
    setModified(false);
  }, [modified]);

  // Delete reports from the database

  const deleteReport = async (report: Report) => {
    const confirmed = await confirmDialog({
      title: "Bejelentés törlése",
      message:
        "Biztosan törölni szeretnéd ezt a bejelentést? Ez a művelet nem visszavonható.",
    });

    if (!confirmed) return;

    setReports((prev) => prev.filter((r) => r.id !== report.id));
    await axios.delete(`http://localhost:5255/Report/${report.id}`);
  };

  // Toggle report status

  const toggleStatus = async (report: Report) => {
    const updatedStatus = report.status === "lezárt" ? "nyitott" : "lezárt";

    try {
      await axios.put(`http://localhost:5255/Report/${report.id}`, {
        text: report.text,
        subSystem: report.subSystem,
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
      await axios.post("http://localhost:5255/Report", {
        text: reportData.text,
        subSystem: reportData.subSystem,
        status: "Open", // always start with open
      });

      // Refresh list or fetch again if needed
    } catch (error) {
      console.error("Failed to create report:", error);
    }

    setModified(true);
  };

  const toggleShowForm = () => {
    setShowForm(true);
    setShowList(false);
  };

  const toggleShowList = () => {
    setShowList(true);
    setShowForm(false);
  };

  return (
    <>
      <Navbar onShowForm={toggleShowForm} onShowList={toggleShowList} />
      {showForm && (
        <Form
          onCreate={(data) => {
            createReport(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showList && (
        <ReportList
          reports={reports}
          onDelete={deleteReport}
          onToggleStatus={toggleStatus}
        />
      )}
    </>
  );
}

export default App;
