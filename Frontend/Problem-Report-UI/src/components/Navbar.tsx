import { useState } from "react";
import Form from "./Form";

interface NavbarProps {
  onShowForm: () => void;
  onShowList: () => void;
}

function Navbar(NavbarProps: NavbarProps) {
  return (
    <>
      <nav className="flex items-center justify-between px-2 bg-white shadow">
        {/* Logo */}
        <div className="flex items-center">
          <img src="logo-hu-HU.png" className="mr-2" />
          {/* Navigation Buttons */}
          <div className="flex space-x-6">
            <div className="relative group">
              <button
                className="text-gray-700 hover:text-[#236A75] font-medium focus:outline-none hover:underline"
                onClick={NavbarProps.onShowForm}
              >
                Problémabejelentés
              </button>
            </div>
            <div>
              <button
                className="text-gray-700 hover:text-[#236A75] font-medium focus:outline-none hover:underline"
                onClick={NavbarProps.onShowList}
              >
                Bejelentések
              </button>
            </div>
            <div className="text-gray-700 hover:text-[#236A75] font-medium hover:underline">
              Rólunk
            </div>
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
    </>
  );
}

export default Navbar;
