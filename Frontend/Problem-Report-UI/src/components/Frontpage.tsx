import React from "react";

const Frontpage: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#0e3f47] mb-4">
          Problémabejelentő Rendszer
        </h1>
        <p className="text-lg text-gray-600">
          Egyszerű és egységes mód a MindiGIS alrendszerek hibabejelentésére.
        </p>
      </header>

      {/* Sections */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bevezetés</h2>
        <p className="leading-relaxed">
          A rendszer lehetővé teszi a felhasználók számára, hogy egyszerűen és
          egységes módon jelentsenek be igényeket vagy problémákat a{" "}
          <strong>MindiGIS</strong> szoftver alrendszereiben. A fejlesztők és
          üzemeltetők egy közös felületen kezelhetik a beérkezett
          bejelentéseket.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Közönség</h2>
        <p className="leading-relaxed">
          Használói kör: MindiGIS szoftvert használó dolgozók, lakosok,
          fejlesztők, üzemeltetők és adminisztrátorok. A rendszer javítja a
          szolgáltatás színvonalát és a munkaszervezést.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Hatókör</h2>
        <p className="leading-relaxed">
          Lehetővé teszi bejelentések létrehozását, megtekintését,
          státuszváltását és törlését a <strong>MindiGIS</strong> rendszerhez
          kapcsolódóan.
        </p>
      </section>
    </main>
  );
};

export default Frontpage;
