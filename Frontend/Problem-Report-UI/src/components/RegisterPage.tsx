import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    familyName: "",
    givenName: "",
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.givenName,
          last_name: form.familyName,
          username: form.userName,
          email: form.email,
          password: form.password,
          password_confirmation: form.password,
        }),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.ok) {
        alert("Sikeres regisztráció!");
        navigate("/login");
      } else {
        try {
          const errorData = JSON.parse(responseText);
          alert(`Regisztráció sikertelen: ${errorData.message}`);
        } catch {
          alert(
            `Regisztráció sikertelen: ${response.status} - ${responseText.substring(0, 100)}`,
          );
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Hálózati hiba");
    }
  };

  const signUpPlaceholders = [
    "Vezetéknév",
    "Keresztnév",
    "Felhasználónév",
    "Email",
    "Jelszó",
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Regisztráció</h2>
        {["familyName", "givenName", "userName", "email", "password"].map(
          (field, index) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              placeholder={signUpPlaceholders[index]}
              className="w-full mb-3 p-2 border rounded"
              required
            />
          ),
        )}
        <button
          type="submit"
          className="w-full bg-[#236A75] text-white py-2 px-4 rounded hover:bg-[#0E3F47]"
        >
          Regisztráció
        </button>
      </form>
    </div>
  );
}
