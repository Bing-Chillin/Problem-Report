import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");

    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between px-2 bg-white shadow">
      {/* Logo + Nav buttons */}
      <div className="flex items-center">
        <img
          src="logo-hu-HU.png"
          className="mr-2 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex space-x-6">
          <div className="relative group">
            <button
              className="text-gray-700 hover:text-[#236A75] font-medium focus:outline-none hover:underline cursor-pointer"
              onClick={() => navigate("/form")}
            >
              Problémabejelentés
            </button>
          </div>
          <div>
            <button
              className="text-gray-700 hover:text-[#236A75] font-medium focus:outline-none hover:underline cursor-pointer"
              onClick={() => navigate("/reports")}
            >
              Bejelentések
            </button>
          </div>
        </div>
      </div>

      {/* Auth buttons */}
      <div className="flex space-x-2">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white cursor-pointer rounded-full"
          >
            Kijelentkezés
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-[#236A75] border border-[#236A75] rounded-full cursor-pointer hover:bg-green-50"
            >
              Bejelentkezés
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-[#236A75] hover:bg-[#0E3F47] text-white cursor-pointer rounded-full"
            >
              Regisztráció
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
