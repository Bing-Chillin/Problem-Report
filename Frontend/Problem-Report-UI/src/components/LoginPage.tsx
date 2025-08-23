import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import type { AlertType } from "./Alert";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const backgroundImages = [
    "/eger.jpg",
    "/eger2.jpg", 
    "/eger3.jpg"
  ];

  // Debug: Log initial state
  // useEffect(() => {
  //   console.log("LoginPage mounted");
  //   console.log("Background images:", backgroundImages);
  //   console.log("Initial currentImageIndex:", currentImageIndex);
  // }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % backgroundImages.length;
        console.log(`Carousel changing from ${prevIndex} to ${newIndex}`);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

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
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Failed to load image: ${image}`);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log(`Loaded image: ${image}`)}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex min-h-screen">
        <div className="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm shadow-2xl flex flex-col justify-center px-8 py-12">
          <div className="mb-8 text-center">
            <img
              src="/logo-hu-HU.png"
              alt="Logo"
              className="h-22 mx-auto mb-6"
            />
            <p className="text-gray-600">
              <b>Problémabejelentő rendszer</b>
            </p>
          </div>

          {/* Alert */}
          {alert.show && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={hideAlert}
                autoClose={true}
                autoCloseDelay={alert.type === "success" ? 2000 : 5000}
              />
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Email cím vagy felhasználónév"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236A75] focus:border-[#236A75] transition-colors"
                required
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jelszó"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236A75] focus:border-[#236A75] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#236A75] text-white py-3 px-4 rounded-lg hover:bg-[#0E3F47] transition-colors font-medium"
            >
              Bejelentkezés
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Még nincs fiókod?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#236A75] hover:text-[#0E3F47] font-medium transition-colors"
              >
                Regisztrálj itt
              </button>
            </p>
          </div>
          {/* carousel dots */}
          <div className="mt-8 flex justify-center space-x-3">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log(`Manually setting image index to: ${index}`);
                  setCurrentImageIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-[#236A75] scale-110 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right side - just shows the background image */}
        <div className="flex-1 hidden md:block" />
      </div>
    </div>
  );
}

