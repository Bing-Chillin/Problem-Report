import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import axios, { AxiosError } from "axios";
import Form from "./components/Form";
import ReportList from "./components/ReportList";

function App() {
  interface Report {
    date: string;
    id: string;
    imagePath: string;
    imageType: string;
    subSystem: string;
    text: string;
    status: string;
  }

  //fetch reports from the API

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    axios
      .get<Report[]>("http://localhost:5255/Report")
      .then((res) => {
        setReports(res.data);
        console.log("Reports fetched successfully:", res.data);
      })
      .catch((error: AxiosError) => {
        console.log("Error fetching reports:", error.message);
      });
  }, []);

  const deleteReport = (report: Report) => {
    setReports(reports.filter((r) => r.id !== report.id));

    axios.delete(`http://localhost:5255/Report/${report.id}`);
  };

  return (
    <>
      <Navbar />
      {/* <Form /> */}
      <ReportList reports={reports} onDelete={deleteReport} />
    </>
  );
}

export default App;
