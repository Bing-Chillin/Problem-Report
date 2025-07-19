function Navbar() {
  return (
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
  );
}

export default Navbar;
