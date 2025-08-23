import { useState } from "react";
import {
  canDeleteReports,
  isLoggedIn,
  canViewAllReports,
  canModifyReportStatus,
} from "../utils/auth";

export interface Report {
  id: number;
  subsystem: string;
  text: string;
  imagePath: string | null;
  imageType: string | null;
  date: string;
  status: string;
  email: string;
  name?: string;
}

interface ReportListProps {
  reports: Report[];
  onDelete: (report: Report) => void;
  onToggleStatus: (report: Report) => void;
  onStatusChange?: (report: Report, newStatus: string) => void;
}

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

function ReportList({
  reports,
  onDelete,
  onToggleStatus,
  onStatusChange,
}: ReportListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalImage, setDetailModalImage] = useState<string | null>(null);

  const handleStatusChange = (report: Report, newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(report, newStatus);
    } else {
      onToggleStatus(report);
    }
  };

  const handleImageClick = async (reportId: number) => {
    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kérjük jelentkeyyen be");
        setImageLoading(false);
        return;
      }

      let imageEndpoint;
      if (canViewAllReports()) {
        imageEndpoint = `http://localhost:8000/api/reports/${reportId}/image`;
      } else {
        imageEndpoint = `http://localhost:8000/api/my-reports/${reportId}/image`;
      }

      const response = await fetch(imageEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setSelectedImage(imageUrl);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to load image:",
          response.status,
          response.statusText,
          errorText,
        );

        if (response.status === 404) {
          alert(
            "A kép nem található. Lehet, hogy nem lett feltöltve kép ehhez a bejelentéshez.",
          );
        } else if (response.status === 401 || response.status === 403) {
          alert("Nincs jogosultságod a kép megtekintéséhez.");
        } else {
          alert(
            `Nem sikerült betölteni a képet. Hiba: ${response.status} ${response.statusText}`,
          );
        }
      }
    } catch (error) {
      console.error("Error loading image:", error);
      alert("Hiba történt a kép betöltése során.");
    } finally {
      setImageLoading(false);
    }
  };

  const closeModal = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  const openDetailModal = async (report: Report) => {
    setSelectedReport(report);

    if (report.imagePath) {
      setImageLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setDetailModalImage(null);
          return;
        }

        let imageEndpoint;
        if (canViewAllReports()) {
          imageEndpoint = `http://localhost:8000/api/reports/${report.id}/image`;
        } else {
          imageEndpoint = `http://localhost:8000/api/my-reports/${report.id}/image`;
        }

        const response = await fetch(imageEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setDetailModalImage(imageUrl);
        } else {
          setDetailModalImage(null);
        }
      } catch (error) {
        console.error("Error loading detail modal image:", error);
        setDetailModalImage(null);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const closeDetailModal = () => {
    if (detailModalImage) {
      URL.revokeObjectURL(detailModalImage);
    }
    setSelectedReport(null);
    setDetailModalImage(null);
  };

  return (
    <>
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {isLoggedIn()
              ? "Nincsenek bejelentéseid"
              : "Nincsenek bejelentések"}
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            {isLoggedIn()
              ? "Még nem küldtél be egyetlen bejelentést sem. A Problémabejelentés gombra kattintva küldhetsz be új bejelentést."
              : "Jelenleg nincsenek elérhető bejelentések."}
          </p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-gray-100 px-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="flex justify-between gap-x-6 py-5 items-center border-b hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => openDetailModal(report)}
            >
              {/* Left - Subsystem, Sender, Date */}
              <div className="flex flex-col text-sm text-gray-700 w-1/4">
                <span className="font-semibold">
                  {report.name || "Ismeretlen felhasználó"}
                </span>
                <span>
                  {subsystemLabels[report.subsystem] ?? report.subsystem}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(report.date).toLocaleString()}
                </span>
              </div>

              {/* Middle - Text and Image */}
              <div className="flex flex-col gap-2 text-sm text-gray-900 w-2/4">
                <div className="truncate">{report.text}</div>
                {report.imagePath && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(report.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs underline text-left flex items-center gap-1"
                      disabled={imageLoading}
                    >
                      📷 {imageLoading ? "Betöltés..." : "Kép megtekintése"}
                    </button>
                    <span className="text-xs text-gray-400">
                      ({report.imageType?.toUpperCase()})
                    </span>
                  </div>
                )}
              </div>

              {/* Right - Status & Delete */}
              <div
                className="flex flex-col items-end w-1/4 gap-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                {canModifyReportStatus() ? (
                  <div className="relative">
                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusChange(report, e.target.value)
                      }
                      className={`px-3 py-1 rounded-md text-xs font-medium text-white border-none outline-none appearance-none pr-8
                        ${statusColors[report.status] || "bg-gray-500"}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1rem 1rem",
                      }}
                    >
                      <option value="nyitott">Nyitott</option>
                      <option value="folyamatban">Folyamatban</option>
                      <option value="lezárt">Lezárt</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${statusColors[report.status] || "bg-gray-500"}`}
                    />
                    <span className="text-xs text-gray-500 select-none">
                      {statusLabels[report.status] || report.status}
                    </span>
                  </div>
                )}

                {canDeleteReports() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(report);
                    }}
                    className="text-red-500 hover:bg-red-500 hover:text-white rounded-full px-2 py-1 border border-red-500 text-xs"
                  >
                    Törlés
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[#236A75] to-[#0E3F47]">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Bejelentés részletei</h2>
                <p className="text-blue-100">#{selectedReport.id}</p>
              </div>
              <button
                onClick={closeDetailModal}
                className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                aria-label="Bezárás"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Details - left */}
                <div className="space-y-6">
                  {/* Basic Info */}
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
                          {selectedReport.name || "Ismeretlen felhasználó"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {selectedReport.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Alrendszer:
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {subsystemLabels[selectedReport.subsystem] ??
                            selectedReport.subsystem}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Dátum:
                        </span>
                        <span className="text-gray-900">
                          {new Date(selectedReport.date).toLocaleString(
                            "hu-HU",
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          Státusz:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[selectedReport.status] || "bg-gray-500"}`}
                        >
                          {statusLabels[selectedReport.status] ||
                            selectedReport.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                        📝
                      </span>
                      Leírás
                    </h3>
                    <div className="bg-gray-50 p-4 rounded border-l-4 border-[#236A75]">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedReport.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-6">
                  {selectedReport.imagePath ? (
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="bg-[#236A75] text-white p-2 rounded-full mr-3">
                          📷
                        </span>
                        Mellékelt kép
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {imageLoading ? (
                          <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#236A75]"></div>
                            <span className="ml-3 text-gray-500">
                              Kép betöltése...
                            </span>
                          </div>
                        ) : detailModalImage ? (
                          <div className="relative">
                            <img
                              src={detailModalImage}
                              alt="Report attachment"
                              className="max-w-full h-auto object-contain mx-auto rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ maxHeight: "400px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(detailModalImage);
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const errorDiv = document.createElement("div");
                                errorDiv.className =
                                  "text-red-500 text-center p-8";
                                errorDiv.textContent = "A kép nem tölthető be.";
                                target.parentNode?.appendChild(errorDiv);
                              }}
                            />
                            <div className="mt-2 text-xs text-gray-500 text-center">
                              Fájltípus:{" "}
                              {selectedReport.imageType?.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-8 text-gray-500">
                            <span className="text-4xl mb-2 block">🚫</span>A kép
                            nem tölthető be
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
                      <span className="text-4xl text-gray-400 mb-2 block">
                        📷
                      </span>
                      <p className="text-gray-500">Nincs mellékelt kép</p>
                    </div>
                  )}

                  {/* Actions */}
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
                            value={selectedReport.status}
                            onChange={(e) => {
                              handleStatusChange(
                                selectedReport,
                                e.target.value,
                              );
                              setSelectedReport({
                                ...selectedReport,
                                status: e.target.value,
                              });
                            }}
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
                            closeDetailModal();
                            onDelete(selectedReport);
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
      )}

      {/* Image Modal */}
      {(selectedImage || imageLoading) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={!imageLoading ? closeModal : undefined}
        >
          <div
            className="bg-white rounded-lg max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {imageLoading ? "Kép betöltése..." : "Feltöltött kép"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Bezárás"
                disabled={imageLoading}
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto">
              {imageLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Kép betöltése...</div>
                </div>
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Report attachment"
                  className="max-w-full h-auto object-contain mx-auto block"
                  style={{ maxHeight: "70vh" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const errorDiv = document.createElement("div");
                    errorDiv.className = "text-red-500 text-center p-8";
                    errorDiv.textContent = "A kép nem tölthető be.";
                    target.parentNode?.appendChild(errorDiv);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportList;
