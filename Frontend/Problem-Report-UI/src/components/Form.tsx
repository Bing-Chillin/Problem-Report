import { useState } from "react";
import type { FormEvent } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

export type ReportFormData = {
  text: string;
  subsystem: string;
  image?: File | null;
};

export default function Form({
  onCreate,
}: {
  onCreate: (data: ReportFormData) => void;
}) {
  const [text, setText] = useState("");
  const [subsystem, setSubsystem] = useState("None");
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    if (!text || subsystem === "None") {
      alert("Tölts ki minden mezőt!");
      return;
    }

    onCreate({ text, subsystem, image: file });

    setSuccessMessage("Sikeres mentés!");

    setText("");
    setSubsystem("None");
    setFile(null);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
      {successMessage && (
        <div className="mb-4 text-green-600 font-medium bg-green-50 border border-green-300 rounded p-2">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="subsystem"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Alrendszer
        </label>
        <select
          id="subsystem"
          name="subsystem"
          value={subsystem}
          onChange={(e) => setSubsystem(e.target.value)}
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-[#236a75] focus:ring-[#236a75]"
        >
          <option value="None" disabled>
            Válassz alrendszert
          </option>
          <option value="Cemetery">Temető</option>
          <option value="CityMaintenance">Városüzemeltetés</option>
          <option value="TaskManagement">Feladatkezelés</option>
          <option value="ProblemReport">Hibabejelentő</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Hibaleírás
        </label>
        <textarea
          id="about"
          name="about"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm focus:border-[#236a75] focus:ring-[#236a75]"
          placeholder="Írd le a hibát..."
          required
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
        >
          <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
          Kép feltöltése (opcionális)
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null;
            if (selectedFile) {
              // Validate file size (2MB = 2 * 1024 * 1024 bytes)
              if (selectedFile.size > 2 * 1024 * 1024) {
                alert("A fájl mérete túl nagy! Maximum 2MB engedélyezett.");
                e.target.value = ""; // Clear the input
                return;
              }
              // Validate file type
              const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
              if (!allowedTypes.includes(selectedFile.type)) {
                alert("Csak JPG és PNG fájlok engedélyezettek!");
                e.target.value = ""; // Clear the input
                return;
              }
            }
            setFile(selectedFile);
          }}
          className="sr-only"
        />
        {file && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  ✓ Kiválasztott fájl: {file.name}
                </p>
                <p className="text-xs text-green-600">
                  Méret: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  // Clear the file input
                  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Eltávolítás
              </button>
            </div>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          PNG vagy JPEG formátum, maximum 2MB
        </p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-[#236a75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0E3F47]"
        >
          Mentés
        </button>
      </div>
    </form>
  );
}
