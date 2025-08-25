import { useState, useEffect } from "react";
import { canDeleteReports, canModifyReportStatus } from "../utils/auth";
import type { Report } from "./ReportList";

const subsystemLabels: Record<string, string> = {
  Cemetery: "Temető",
  CityMaintenance: "Városüzemeltetés",
  TaskManagement: "Feladatkezelés",
  ProblemReport: "Hibabejelentő",
};

const statusLabels: Record<string, string> = {
  nyitott: "Nyitott",
  folyamatban: "Folyamatban",
  lezárt: "Lezárt",
};

const statusColors: Record<string, string> = {
  nyitott: "bg-red-500",
  folyamatban: "bg-yellow-500",
  lezárt: "bg-green-500",
};

interface ReportDetailModalProps {
  report: Report | null;
  images: string[];
  currentImageIndex: number;
  imageLoading: boolean;
  onClose: () => void;
  onStatusChange: (report: Report, newStatus: string) => void;
  onDelete: (report: Report) => void;
  onImageNavigate: (direction: "prev" | "next") => void;
  onImageClick: (imageUrl: string, index: number) => void;
}

export default function ReportDetailModal({
  report,
  images,
  currentImageIndex,
  imageLoading,
  onClose,
  onStatusChange,
  onDelete,
  onImageNavigate,
  onImageClick,
}: ReportDetailModalProps) {
  const [localReport, setLocalReport] = useState<Report | null>(report);

  useEffect(() => {
    setLocalReport(report);
  }, [report]);

  if (!localReport) return null;

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(localReport, newStatus);
    setLocalReport({ ...localReport, status: newStatus });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[#236A75] to-[#0E3F47]">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Bejelentés részletei</h2>
            <p className="text-blue-100">#{localReport.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            aria-label="Bezárás"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                    📋
                  </span>
                  Alapadatok
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Bejelentő:
                    </span>
                    <span className="text-gray-900">
                      {localReport.name || "Ismeretlen felhasználó"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">{localReport.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Alrendszer:
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {subsystemLabels[localReport.subsystem] ??
                        localReport.subsystem}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Dátum:</span>
                    <span className="text-gray-900">
                      {new Date(localReport.date).toLocaleString("hu-HU")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Státusz:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[localReport.status] || "bg-gray-500"}`}
                    >
                      {statusLabels[localReport.status] || localReport.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                    📝
                  </span>
                  Leírás
                </h3>
                <div className="bg-gray-50 p-4 rounded border-l-4 border-[#236A75]">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {localReport.text}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {(localReport.images && localReport.images.length > 0) ||
              localReport.imagePath ? (
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                        📷
                      </span>
                      Mellékelt képek
                      {localReport.images && localReport.images.length > 1 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {localReport.images.length}
                        </span>
                      )}
                    </span>
                    {images.length > 1 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onImageNavigate("prev")}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                          title="Előző kép"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => onImageNavigate("next")}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
                          title="Következő kép"
                        >
                          ▶
                        </button>
                      </div>
                    )}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {imageLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#236A75]"></div>
                        <span className="ml-3 text-gray-500">
                          Képek betöltése...
                        </span>
                      </div>
                    ) : images[currentImageIndex] ? (
                      <div className="relative group">
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => onImageNavigate("prev")}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                              title="Előző kép"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => onImageNavigate("next")}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                              title="Következő kép"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all">
                              {currentImageIndex + 1} / {images.length}
                            </div>
                          </>
                        )}

                        <img
                          src={images[currentImageIndex]}
                          alt={`Report attachment ${currentImageIndex + 1}`}
                          className="max-w-full h-auto object-contain mx-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ maxHeight: "400px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(
                              images[currentImageIndex],
                              currentImageIndex,
                            );
                          }}
                        />
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          {localReport.images &&
                          localReport.images.length > 0 ? (
                            <>
                              Fájltípus:{" "}
                              {localReport.images[
                                currentImageIndex
                              ]?.type?.toUpperCase()}
                              <br />
                              Fájlnév:{" "}
                              {localReport.images[currentImageIndex]?.filename}
                            </>
                          ) : (
                            `Fájltípus: ${localReport.imageType?.toUpperCase()}`
                          )}
                        </div>

                        {images.length > 1 && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  onImageClick(images[index], index)
                                }
                                className={`w-4 h-4 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? "bg-[#236A75] scale-125 shadow-md"
                                    : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                                }`}
                                title={`Kép ${index + 1}${localReport.images?.[index] ? ` - ${localReport.images[index].filename}` : ""}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-8 text-gray-500">
                        <span className="text-4xl mb-2 block">🚫</span>A képek
                        nem tölthetők be
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
                  <span className="text-4xl text-gray-400 mb-2 block">📷</span>
                  <p className="text-gray-500">Nincs mellékelt kép</p>
                </div>
              )}

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                    ⚡
                  </span>
                  Műveletek
                </h3>
                <div className="space-y-3">
                  {canModifyReportStatus() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Státusz módosítása:
                      </label>
                      <select
                        value={localReport.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#236A75] focus:border-[#236A75]"
                      >
                        <option value="nyitott">Nyitott</option>
                        <option value="folyamatban">Folyamatban</option>
                        <option value="lezárt">Lezárt</option>
                      </select>
                    </div>
                  )}

                  {canDeleteReports() && (
                    <button
                      onClick={() => {
                        onClose();
                        onDelete(localReport);
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
                    >
                      🗑️ Bejelentés törlése
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
