import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import type { AlertType } from "./Alert";

export default function RegisterPage() {
  const [form, setForm] = useState({
    familyName: "",
    givenName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState<{
    show: boolean;
    type: AlertType;
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const navigate = useNavigate();

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "info", message: "" });
  };

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

      if (response.ok) {
        showAlert("success", "Sikeres regisztráció! Átirányítás a bejelentkezéshez...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        let errorMessage = "Regisztráció sikertelen!";
        
        try {
          const errorData = JSON.parse(responseText);
          
          switch (response.status) {
            case 422:
              errorMessage = "Kérjük, töltsd ki helyesen az összes mezőt! Ellenőrizd, hogy minden adat megfelelő formátumban van megadva.";
              break;
              
            case 409:
              // Conflict
              if (errorData.message && errorData.message.toLowerCase().includes('email')) {
                errorMessage = "Ez az email cím már regisztrálva van!";
              } else if (errorData.message && errorData.message.toLowerCase().includes('username')) {
                errorMessage = "Ez a felhasználónév már foglalt!";
              } else {
                errorMessage = "A felhasználó már létezik!";
              }
              break;
              
            case 429:
              // Too many requests
              errorMessage = "Túl sok regisztrációs kísérlet! Kérjük, várj egy kicsit.";
              break;
              
            case 500:
              // Server error
              errorMessage = "Szerverhiba! Kérjük, próbáld újra később.";
              break;
              
            default:
              if (errorData.message) {
                errorMessage = `Hiba: ${errorData.message}`;
              } else {
                errorMessage = "Ismeretlen hiba történt a regisztráció során!";
              }
          }
          
          showAlert("error", errorMessage);
        } catch {
          if (response.status === 422) {
            showAlert("error", "Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.");
          } else if (response.status >= 500) {
            showAlert("error", "Szerverhiba! Kérjük, próbáld újra később.");
          } else {
            showAlert("error", "Regisztráció sikertelen! Kérjük, próbáld újra.");
          }
        }
      }
    } catch (error) {
      showAlert("error", "Hálózati hiba! Kérjük, ellenőrizd az internetkapcsolatot és próbáld újra.");
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
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {alert.show && (
          <div className="mb-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={hideAlert}
              autoClose={true}
              autoCloseDelay={alert.type === "success" ? 3000 : 5000}
            />
          </div>
        )}
        
        <form onSubmit={handleRegister}>
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
    </div>
  );
}
