import {
  faBug,
  faLightbulb,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function Frontpage() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="frontpage"
        className="h-screen w-full bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{ backgroundImage: 'url("/phone.jpg")' }}
      >
        <div>
          <h1 className="text-6xl md:text-7xl text-white font-extrabold mb-4">
            Problémabejelntő alrendszer
          </h1>
          <p className="text-white md:text-xl max-w-2xl mx-auto">
            Egyszerű és egységes mód a MindiGIS alrendszerek hibabejelentésére.
          </p>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14.5">
          <h2 className="text-3xl font-semibold mb-4">Szolgáltatásaink</h2>
          <p className="text-gray-600">
            Egy gyors betekintés, hogyan tesszük egyszerűbbé a dolgod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          <div className="rounded-lg overflow-hidden">
            <div className="text-black text-9xl text-center pb-8">
              <FontAwesomeIcon icon={faPhoneSlash} />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-xl mb-2">Egyszerű használat</h3>
              <p className="text-gray-600">
                Fejlesztőink könnyen, egy helyen elérik az bejelentéseiket
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden text-center">
            <button
              className="text-black text-9xl text-center pb-8"
              //onClick={() => navigate("/form")}
            >
              <FontAwesomeIcon icon={faLightbulb} className="cursor-pointer" />
            </button>
            <div className="p-4 text-center">
              <h3 className="font-bold text-xl mb-2">Van egy ötlete?</h3>
              <p className="text-gray-600">Ossza meg velünk!</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden text-center">
            <button
              className="text-black text-9xl text-center pb-8"
              //</div>onClick={() => navigate("/form")}
            >
              <FontAwesomeIcon icon={faBug} className="cursor-pointer" />
            </button>
            <div className="p-4 text-center">
              <h3 className="font-bold text-xl mb-2">Hibába ütközött?</h3>
              <p className="text-gray-600">
                Egyszerűen és gyorsan jelezheti felénk
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Frontpage;
