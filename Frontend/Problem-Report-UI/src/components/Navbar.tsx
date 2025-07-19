import { useState } from "react";
import Form from "./Form";

function Navbar() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-2 bg-white shadow">
        {/* Logo */}
        <div className="flex items-center">
          <img src="logo-hu-HU.png" className="mr-2" />
          {/* Navigation Buttons */}
          <div className="flex space-x-6">
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#236A75] font-medium focus:outline-none hover:underline">
                Szolgáltatások 
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ul>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                      onClick={() => setShowForm(true)}
                    >
                      Problémabejelentés
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                    >
                      Elem 2
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <a
              href="#"
              className="text-gray-700 hover:text-[#236A75] font-medium hover:underline"
            >
              Rólunk
            </a>
          </div>
        </div>
        {/* Auth Buttons */}
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-[#236A75] border border-[#236A75] rounded-full hover:bg-green-50">
            Bejelentkezés
          </button>
          <button className="px-4 py-2 bg-[#236A75] hover:bg-[#0E3F47] text-white rounded-full hover:bg-">
            Regisztráció
          </button>
        </div>
      </nav>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <Form />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
