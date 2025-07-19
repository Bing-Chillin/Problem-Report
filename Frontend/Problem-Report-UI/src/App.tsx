import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import axios, { AxiosError } from "axios";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:5255/Report")
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err.message);
      });
  });
}

export default App;
