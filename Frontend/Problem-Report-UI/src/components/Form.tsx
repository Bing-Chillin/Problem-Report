import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

export interface ReportFormData {
  text: string;
  imagePath: string;
  imageType: string;
  subSystem: string;
}

function Form({
  onCreate,
  onCancel,
}: {
  onCreate: (reportData: ReportFormData) => void;
  onCancel?: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subSystem, setSubSystem] = useState("None");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Kérlek tölts fel képet.");
      return;
    }

    const newReport = {
      text,
      imagePath: file.name,
      imageType: file.type,
      subSystem: subSystem,
    };

    onCreate(newReport);
  };

  return (
    <form className="mx-60 my-6" onSubmit={handleSubmit}>
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
          value={subSystem}
          onChange={(e) => setSubSystem(e.target.value)}
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

      <label
        htmlFor="about"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Hibaleírás
      </label>
      <textarea
        id="about"
        name="about"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm focus:border-[#236a75] focus:ring-[#236a75]"
        placeholder="Írd le a hibát..."
        required
      />

      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
        >
          <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
          Kép feltöltése
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="sr-only"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Kiválasztott fájl: {file.name}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold text-gray-900 hover:underline"
          onClick={onCancel}
        >
          Mégse
        </button>
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

export default Form;
