import { useState, useEffect } from "react";
import { canViewAllReports, isLoggedIn } from "../utils/auth";
import FilterPanel from "./FilterPanel";
import ReportCard from "./ReportCard";
import ReportDetailModal from "./ReportDetailModal";
import ImageModal from "./ImageModal";

export interface ReportImage {
  id: number;
  filename: string;
  type: string;
  order_index: number;
  url: string;
}

export interface Report {
  id: number;
  subsystem: string;
  text: string;
  images: ReportImage[];
  image_count: number;
  date: string;
  status: string;
  email: string;
  name?: string;
  imagePath?: string | null;
  imageType?: string | null;
}

interface ReportListProps {
  reports: Report[];
  onDelete: (report: Report) => void;
  onToggleStatus: (report: Report) => void;
  onStatusChange?: (report: Report, newStatus: string) => void;
}

export default function ReportList({
  reports,
  onDelete,
  onToggleStatus,
  onStatusChange,
}: ReportListProps) {
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [detailModalImages, setDetailModalImages] = useState<string[]>([]);
  const [detailModalImageIndex, setDetailModalImageIndex] = useState<number>(0);
  const [fullSizeImageIndex, setFullSizeImageIndex] = useState<number>(0);

  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  const handleStatusChange = (report: Report, newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(report, newStatus);
    } else {
      onToggleStatus(report);
    }
  };

  const handleImageClick = async (reportId: number, imageIndex: number = 0) => {
    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kérjük jelentkezzen be");
        setImageLoading(false);
        return;
      }

      let imageEndpoint;
      if (canViewAllReports()) {
        imageEndpoint = `http://localhost:8000/api/reports/${reportId}/image/${imageIndex}`;
      } else {
        imageEndpoint = `http://localhost:8000/api/my-reports/${reportId}/image/${imageIndex}`;
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
        setFullSizeImageIndex(imageIndex);
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

  const openDetailModal = async (report: Report) => {
    setSelectedReport(report);
    setDetailModalImageIndex(0);

    if ((report.images && report.images.length > 0) || report.imagePath) {
      setImageLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setDetailModalImages([]);
          return;
        }

        const imageCount = report.images ? report.images.length : 1;
        const loadedImages: string[] = [];

        for (let i = 0; i < imageCount; i++) {
          try {
            let imageEndpoint;
            if (canViewAllReports()) {
              imageEndpoint = `http://localhost:8000/api/reports/${report.id}/image/${i}`;
            } else {
              imageEndpoint = `http://localhost:8000/api/my-reports/${report.id}/image/${i}`;
            }

            const response = await fetch(imageEndpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              loadedImages.push(imageUrl);
            }
          } catch (error) {
            console.error(`Error loading image ${i}:`, error);
          }
        }

        setDetailModalImages(loadedImages);
      } catch (error) {
        console.error("Error loading detail modal images:", error);
        setDetailModalImages([]);
      } finally {
        setImageLoading(false);
      }
    } else {
      setDetailModalImages([]);
    }
  };

  const closeDetailModal = () => {
    detailModalImages.forEach((imageUrl) => {
      URL.revokeObjectURL(imageUrl);
    });
    setSelectedReport(null);
    setDetailModalImages([]);
    setDetailModalImageIndex(0);
  };

  const closeImageModal = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setFullSizeImageIndex(0);
  };

  const navigateDetailModalImage = (direction: "prev" | "next") => {
    if (detailModalImages.length <= 1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        detailModalImageIndex > 0
          ? detailModalImageIndex - 1
          : detailModalImages.length - 1;
    } else {
      newIndex =
        detailModalImageIndex < detailModalImages.length - 1
          ? detailModalImageIndex + 1
          : 0;
    }

    setDetailModalImageIndex(newIndex);
  };

  const navigateFullSizeImage = (direction: "prev" | "next") => {
    if (detailModalImages.length <= 1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        fullSizeImageIndex > 0
          ? fullSizeImageIndex - 1
          : detailModalImages.length - 1;
    } else {
      newIndex =
        fullSizeImageIndex < detailModalImages.length - 1
          ? fullSizeImageIndex + 1
          : 0;
    }

    setFullSizeImageIndex(newIndex);
    setSelectedImage(detailModalImages[newIndex]);
  };

  const handleDetailModalImageClick = (imageUrl: string, index: number) => {
    setFullSizeImageIndex(index);
    setSelectedImage(imageUrl);
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
        <>
          <FilterPanel
            reports={reports}
            onFilteredReportsChange={setFilteredReports}
          />

          <div className="grid gap-4 px-4 py-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onReportClick={openDetailModal}
                onImageClick={handleImageClick}
                imageLoading={imageLoading}
              />
            ))}
          </div>
        </>
      )}

      <ReportDetailModal
        report={selectedReport}
        images={detailModalImages}
        currentImageIndex={detailModalImageIndex}
        imageLoading={imageLoading}
        onClose={closeDetailModal}
        onStatusChange={handleStatusChange}
        onDelete={onDelete}
        onImageNavigate={navigateDetailModalImage}
        onImageClick={handleDetailModalImageClick}
      />

      <ImageModal
        selectedImage={selectedImage}
        images={detailModalImages}
        currentIndex={fullSizeImageIndex}
        imageLoading={imageLoading}
        onClose={closeImageModal}
        onNavigate={navigateFullSizeImage}
        report={selectedReport}
      />
    </>
  );
}
