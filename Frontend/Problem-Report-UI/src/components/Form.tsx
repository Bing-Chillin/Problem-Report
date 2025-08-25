import { useState } from "react";
import type { FormEvent } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Alert from "./Alert";
import type { AlertType } from "./Alert";

export type ReportFormData = {
  text: string;
  subsystem: string;
  images?: File[];
};

export default function Form({
  onCreate,
}: {
  onCreate: (data: ReportFormData) => void;
}) {
  const [text, setText] = useState("");
  const [subsystem, setSubsystem] = useState("None");
  const [files, setFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: AlertType;
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "info", message: "" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text || subsystem === "None") {
      showAlert("error", "Tölts ki minden mezőt!");
      return;
    }

    onCreate({ text, subsystem, images: files });

    showAlert("success", "Sikeres mentés!");

    setText("");
    setSubsystem("None");
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
      {alert.show && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
            autoClose={true}
            autoCloseDelay={5000}
          />
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
          className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium cursor-pointer transition-colors border-2 border-dashed ${
            files.length >= 5
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
          }`}
        >
          <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
          {files.length === 0
            ? "Képek feltöltése (maximum 5 db, opcionális)"
            : files.length >= 5
              ? "Maximum képszám elérve (5/5)"
              : `További képek hozzáadása (${files.length}/5)`}
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg"
          disabled={files.length >= 5}
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);

            if (files.length + selectedFiles.length > 5) {
              showAlert(
                "error",
                `Maximum 5 kép tölthető fel! Jelenleg ${files.length} kép van kiválasztva.`,
              );
              e.target.value = "";
              return;
            }

            for (const file of selectedFiles) {
              if (file.size > 2 * 1024 * 1024) {
                showAlert(
                  "error",
                  `A fájl "${file.name}" túl nagy! Maximum 2MB engedélyezett.`,
                );
                e.target.value = "";
                return;
              }

              const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
              if (!allowedTypes.includes(file.type)) {
                showAlert(
                  "error",
                  `A fájl "${file.name}" nem támogatott! Csak JPG és PNG fájlok engedélyezettek.`,
                );
                e.target.value = "";
                return;
              }
            }

            setFiles([...files, ...selectedFiles]);
            e.target.value = "";
          }}
          className="sr-only"
        />
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Kiválasztott képek ({files.length}/{5})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                >
                  {/* Image Preview */}
                  <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        setTimeout(() => URL.revokeObjectURL(img.src), 1000);
                      }}
                    />
                  </div>

                  {/* File Info */}
                  <div className="space-y-1">
                    <p
                      className="text-sm font-medium text-gray-900 truncate"
                      title={file.name}
                    >
                      {file.name.length > 20
                        ? `${file.name.substring(0, 17)}...`
                        : file.name}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="uppercase">
                        {file.type.split("/")[1]}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = files.filter((_, i) => i !== index);
                      setFiles(newFiles);
                      if (newFiles.length === 0) {
                        const fileInput = document.getElementById(
                          "file-upload",
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-sm"
                    title="Kép eltávolítása"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Image Order Indicator */}
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {files.length === 5 && "Maximum képszám elérve"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  const fileInput = document.getElementById(
                    "file-upload",
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Összes eltávolítása
              </button>
            </div>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          PNG vagy JPEG formátum, maximum 2MB per kép, legfeljebb 5 kép
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
