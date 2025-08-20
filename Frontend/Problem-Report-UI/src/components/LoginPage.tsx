import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
      } else {
        try {
          const errorData = JSON.parse(responseText);
          alert(`Login failed: ${errorData.error || "Unknown error"}`);
        } catch {
          alert(
            `Login failed: ${response.status} - ${responseText.substring(0, 100)}`,
          );
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Bejelentkezés</h2>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Email vagy felhasználónév"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Jelszó"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#236A75] text-white py-2 px-4 rounded hover:bg-[#0E3F47]"
        >
          Bejelentkezés
        </button>
      </form>
    </div>
  );
}
