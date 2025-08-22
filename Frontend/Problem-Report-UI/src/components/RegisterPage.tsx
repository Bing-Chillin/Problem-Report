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

  const getHungarianFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      'first_name': 'Keresztnév',
      'last_name': 'Vezetéknév',
      'username': 'Felhasználónév',
      'email': 'Email',
      'password': 'Jelszó',
      'password_confirmation': 'Jelszó megerősítés'
    };
    return fieldNames[field] || field;
  };

  const translateValidationMessage = (message: string): string => {
    const translations: Record<string, string> = {
      'required': 'kötelező mező',
      'email': 'érvényes email címet adj meg',
      'min': 'túl rövid',
      'max': 'túl hosszú',
      'confirmed': 'a jelszavak nem egyeznek',
      'unique': 'már létezik',
      'alpha': 'csak betűket tartalmazhat',
      'alpha_num': 'csak betűket és számokat tartalmazhat'
    };

    for (const [key, translation] of Object.entries(translations)) {
      if (message.toLowerCase().includes(key)) {
        return translation;
      }
    }
    
    return message;
  };

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
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

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
              if (errorData.errors) {
                const fieldErrors: string[] = [];
                
                Object.entries(errorData.errors).forEach(([field, messages]) => {
                  const fieldName = getHungarianFieldName(field);
                  const messageArray = Array.isArray(messages) ? messages : [messages];
                  messageArray.forEach((msg: string) => {
                    fieldErrors.push(`${fieldName}: ${translateValidationMessage(msg)}`);
                  });
                });
                
                errorMessage = fieldErrors.join('\n');
              } else {
                errorMessage = "Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.";
              }
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
      console.error("Network error:", error);
      showAlert("error", "Hálózati hiba");
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
