import { useState } from "react";

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
  access: boolean;
}

const subsystemLabels: Record<string, string> = {
  Cemetery: "Temető",
  CityMaintenance: "Városüzemeltetés",
  TaskManagement: "Feladatkezelés",
  ProblemReport: "Hibabejelentő",
};

function ReportList({
  reports,
  onDelete,
  onToggleStatus,
  access,
}: ReportListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  if (!access) {
    return (
      <h1 className="text-3xl text-black py-3">
        Sajnálom, nincs jogosultságod ehhez a művelethez :(
      </h1>
    );
  }

  const handleImageClick = async (reportId: number) => {
    setImageLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Nincs érvényes bejelentkezés!');
        setImageLoading(false);
        return;
      }

      console.log(`Attempting to fetch image for report ID: ${reportId}`);
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}/image`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setSelectedImage(imageUrl);
      } else {
        // Try to get error message from response
        const errorText = await response.text();
        console.error('Failed to load image:', response.status, response.statusText, errorText);
        
        if (response.status === 404) {
          alert('A kép nem található. Lehet, hogy nem lett feltöltve kép ehhez a bejelentéshez.');
        } else if (response.status === 401 || response.status === 403) {
          alert('Nincs jogosultságod a kép megtekintéséhez.');
        } else {
          alert(`Nem sikerült betölteni a képet. Hiba: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Hiba történt a kép betöltése során.');
    } finally {
      setImageLoading(false);
    }
  };

  const closeModal = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage); // Clean up blob URL
    }
    setSelectedImage(null);
  };

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100 px-4">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex justify-between gap-x-6 py-5 items-center border-b"
          >
            {/* Left - Subsystem, Sender, Date */}
            <div className="flex flex-col text-sm text-gray-700 w-1/4">
              <span className="font-semibold">
                {report.name || "Ismeretlen felhasználó"}
              </span>
              <span>{subsystemLabels[report.subsystem] ?? report.subsystem}</span>
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
                    onClick={() => handleImageClick(report.id)}
                    className="text-blue-500 hover:text-blue-700 text-xs underline text-left flex items-center gap-1"
                    disabled={imageLoading}
                  >
                    📷 {imageLoading ? 'Betöltés...' : 'Kép megtekintése'}
                  </button>
                  <span className="text-xs text-gray-400">
                    ({report.imageType?.toUpperCase()})
                  </span>
                </div>
              )}
            </div>

            {/* Right - Status & Delete */}
            <div className="flex flex-col items-end w-1/4 gap-y-2">
              <button
                onClick={() => onToggleStatus(report)}
                aria-label={report.status === "lezárt" ? "Lezárt" : "Nyitott"}
                className={`w-5 h-5 rounded-full 
                  ${report.status === "lezárt" ? "bg-green-500" : "bg-red-500"} 
                  ring-2 ring-gray-300 hover:ring-gray-600 transition`}
              />
              <span className="text-xs text-gray-500 select-none">
                {report.status === "lezárt" ? "Lezárt" : "Nyitott"}
              </span>

              <button
                onClick={() => onDelete(report)}
                className="text-red-500 hover:bg-red-500 hover:text-white rounded-full px-2 py-1 border border-red-500 text-xs"
              >
                Törlés
              </button>
            </div>
          </li>
        ))}
      </ul>

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
                {imageLoading ? 'Kép betöltése...' : 'Feltöltött kép'}
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
                  style={{ maxHeight: '70vh' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-red-500 text-center p-8';
                    errorDiv.textContent = 'A kép nem tölthető be.';
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
