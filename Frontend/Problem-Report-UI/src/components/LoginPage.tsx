import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import type { AlertType } from "./Alert";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
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

  const translateErrorMessage = (message: string): string => {
    const translations: Record<string, string> = {
      'login_required': 'Felhasználónév vagy email megadása kötelező',
      'password_required': 'Jelszó megadása kötelező',
      'email_not_found': 'Ismeretlen email cím',
      'username_not_found': 'Ismeretlen felhasználónév',
      'password_incorrect': 'Hibás jelszó',
    };
    return translations[message] || message;
  };

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "info", message: "" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        showAlert("success", "Sikeres bejelentkezés! Átirányítás...");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      } else {
        let errorMessage = "Bejelentkezés sikertelen!";
        
        try {
          const errorData = JSON.parse(responseText);
          switch (response.status) {
            case 401:
              // Unauthorized - check for specific error types
              if (errorData.error) {
                errorMessage = translateErrorMessage(errorData.error);
              } else if (errorData.error && errorData.error.toLowerCase().includes('credential')) {
                errorMessage = "Hibás felhasználónév vagy jelszó!";
              } else {
                errorMessage = "Hibás bejelentkezési adatok!";
              }
              break;
            
            case 422:
              // Validation error
              if (errorData.errors) {
                const fieldErrors: string[] = [];
                
                Object.entries(errorData.errors).forEach(([messages]) => {
                  const messageArray = Array.isArray(messages) ? messages : [messages];
                  messageArray.forEach((msg: string) => {
                    const translatedMessage = translateErrorMessage(msg);
                    fieldErrors.push(translatedMessage);
                  });
                });
                
                errorMessage = fieldErrors.length > 0 ? fieldErrors.join(' ') : "Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.";
              } else {
                errorMessage = "Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.";
              }
              break;
            
            case 429:
              // Too many requests
              errorMessage = "Túl sok bejelentkezési kísérlet! Kérjük, várj egy kicsit.";
              break;
            
            case 500:
              // Server error
              errorMessage = "Szerverhiba! Kérjük, próbáld újra később.";
              break;
            
            case 503:
              // Service unavailable
              errorMessage = "A szolgáltatás jelenleg nem elérhető! Kérjük, próbáld újra később.";
              break;
            
            default:
              // Generic error based on response message
              if (errorData.error) {
                errorMessage = `Hiba: ${errorData.error}`;
              } else if (errorData.message) {
                errorMessage = `Hiba: ${errorData.message}`;
              } else {
                errorMessage = "Ismeretlen hiba történt!";
              }
          }
          
          showAlert("error", errorMessage);
        } catch {
          // If we can't parse the error response
          if (response.status === 401) {
            showAlert("error", "Hibás felhasználónév vagy jelszó!");
          } else if (response.status >= 500) {
            showAlert("error", "Szerverhiba! Kérjük, próbáld újra később.");
          } else {
            showAlert("error", "Bejelentkezés sikertelen! Kérjük, ellenőrizd az adataidat.");
          }
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      showAlert("error", "Hálózati hiba! Kérjük, próbáld újra.");
    }
  };

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
              autoCloseDelay={alert.type === "success" ? 2000 : 5000}
            />
          </div>
        )}
        
        <form onSubmit={handleLogin}>
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
    </div>
  );
}

