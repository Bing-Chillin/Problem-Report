import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import axios, { AxiosError } from "axios";
import Form from "./components/Form";

function App() {
  const [response, setResonse] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5255/Report")
      .then((res) => setResonse(res.data))
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <Navbar />
      <Form />
    </>
  );
}

export default App;
