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
        showAlert(
          "success",
          "Sikeres regisztráció! Átirányítás a bejelentkezéshez...",
        );
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

                Object.entries(errorData.errors).forEach(
                  ([field, messages]) => {
                    const messageArray = Array.isArray(messages)
                      ? messages
                      : [messages];
                    console.log(`Field: ${field}, Messages:`, messageArray);

                    messageArray.forEach((msg: string) => {
                      const msgLower = msg.toLowerCase();

                      if (
                        field === "email" &&
                        (msgLower.includes("unique") ||
                          msgLower.includes("taken") ||
                          msgLower.includes("already") ||
                          msgLower.includes("exists"))
                      ) {
                        fieldErrors.push(
                          "Ez az email cím már regisztrálva van!",
                        );
                      } else if (
                        field === "username" &&
                        (msgLower.includes("unique") ||
                          msgLower.includes("taken") ||
                          msgLower.includes("already") ||
                          msgLower.includes("exists"))
                      ) {
                        fieldErrors.push("Ez a felhasználónév már foglalt!");
                      } else if (
                        field === "email" &&
                        (msgLower.includes("email") ||
                          msgLower.includes("valid") ||
                          msgLower.includes("format"))
                      ) {
                        fieldErrors.push(
                          "Kérjük, adj meg egy érvényes email címet!",
                        );
                      } else if (
                        msgLower.includes("required") ||
                        msgLower.includes("field is required")
                      ) {
                        const fieldName =
                          field === "first_name"
                            ? "Keresztnév"
                            : field === "last_name"
                              ? "Vezetéknév"
                              : field === "username"
                                ? "Felhasználónév"
                                : field === "email"
                                  ? "Email"
                                  : field === "password"
                                    ? "Jelszó"
                                    : field;
                        fieldErrors.push(`${fieldName} kitöltése kötelező!`);
                      } else if (
                        msgLower.includes("min") ||
                        msgLower.includes("too_short") ||
                        msgLower.includes("password_too_short") ||
                        msgLower.includes("short")
                      ) {
                        fieldErrors.push(
                          `A jelszó túl rövid! Minimum 3 karakter szükséges.`,
                        );
                      } else if (
                        msgLower.includes("max") ||
                        msgLower.includes("too_long") ||
                        msgLower.includes("long")
                      ) {
                        const fieldName =
                          field === "first_name"
                            ? "keresztnév"
                            : field === "last_name"
                              ? "vezetéknév"
                              : field === "username"
                                ? "felhasználónév"
                                : field;
                        fieldErrors.push(`A ${fieldName} túl hosszú!`);
                      } else if (
                        msgLower.includes("confirmed") ||
                        msgLower.includes("confirmation") ||
                        msgLower.includes("match")
                      ) {
                        fieldErrors.push("A jelszavak nem egyeznek!");
                      } else {
                        const fieldName =
                          field === "first_name"
                            ? "Keresztnév"
                            : field === "last_name"
                              ? "Vezetéknév"
                              : field === "username"
                                ? "Felhasználónév"
                                : field === "email"
                                  ? "Email"
                                  : field === "password"
                                    ? "Jelszó"
                                    : field;
                        fieldErrors.push(`${fieldName}: ${msg}`);
                      }
                    });
                  },
                );

                errorMessage =
                  fieldErrors.length > 0
                    ? fieldErrors.join("\n")
                    : "Kérjük, töltsd ki helyesen az összes mezőt!";
              } else {
                errorMessage = "Kérjük, töltsd ki helyesen az összes mezőt!";
              }
              break;

            case 409:
              if (
                errorData.message &&
                errorData.message.toLowerCase().includes("email")
              ) {
                errorMessage = "Ez az email cím már regisztrálva van!";
              } else if (
                errorData.message &&
                errorData.message.toLowerCase().includes("username")
              ) {
                errorMessage = "Ez a felhasználónév már foglalt!";
              } else {
                errorMessage = "A felhasználó már létezik!";
              }
              break;

            case 429:
              errorMessage =
                "Túl sok regisztrációs kísérlet! Kérjük, várj egy kicsit.";
              break;

            case 500:
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
            showAlert(
              "error",
              "Érvénytelen adatok! Kérjük, ellenőrizd a mezőket.",
            );
          } else if (response.status >= 500) {
            showAlert("error", "Szerverhiba! Kérjük, próbáld újra később.");
          } else {
            showAlert(
              "error",
              "Regisztráció sikertelen! Kérjük, próbáld újra.",
            );
          }
        }
      }
    } catch (error) {
      showAlert(
        "error",
        "Hálózati hiba! Kérjük, ellenőrizd az internetkapcsolatot és próbáld újra.",
      );
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
