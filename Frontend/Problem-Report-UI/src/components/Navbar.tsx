function Navbar() {
  return (
    <nav className="flex items-center justify-between px-2 bg-white shadow">
      {/* Logo */}
      <div className="flex items-center">
        <img src="logo-hu-HU.png" className="mr-2" />
        {/* Navigation Buttons */}
        <div className="flex space-x-6">
          <div className="relative group">
            <button className="text-gray-700 hover:text-green-900 font-medium focus:outline-none hover:underline">
              Szolgáltatások 
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50"
              >
                Elem 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50"
              >
                Elem 2
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50"
              >
                Elem 3
              </a>
            </div>
          </div>

          <a
            href="#"
            className="text-gray-700 hover:text-green-900 font-medium hover:underline"
          >
            Rólunk
          </a>
        </div>
      </div>
      {/* Auth Buttons */}
      <div className="flex space-x-2">
        <button className="px-4 py-2 border border-green-900 rounded-full hover:bg-green-50">
          Bejelentkezés
        </button>
        <button className="px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-950">
          Regisztráció
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
