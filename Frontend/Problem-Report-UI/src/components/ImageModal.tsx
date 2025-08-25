import { useEffect } from "react";

interface ImageModalProps {
  selectedImage: string | null;
  images: string[];
  currentIndex: number;
  imageLoading: boolean;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  report?: { images?: { filename: string; type: string }[] } | null;
}

export default function ImageModal({
  selectedImage,
  images,
  currentIndex,
  imageLoading,
  onClose,
  onNavigate,
  report,
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage) return;

      if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        onNavigate("prev");
      } else if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        onNavigate("next");
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length, onNavigate, onClose]);

  if (!selectedImage && !imageLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={!imageLoading ? onClose : undefined}
    >
      <div
        className="bg-white rounded-lg max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {imageLoading ? "Kép betöltése..." : "Feltöltött kép"}
            {images.length > 1 && selectedImage && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({currentIndex + 1} / {images.length})
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {images.length > 1 && selectedImage && (
              <>
                <button
                  onClick={() => onNavigate("prev")}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                  title="Előző kép (←)"
                >
                  <svg
                    className="w-5 h-5"
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
                  onClick={() => onNavigate("next")}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                  title="Következő kép (→)"
                >
                  <svg
                    className="w-5 h-5"
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
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Bezárás"
              disabled={imageLoading}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[80vh] overflow-auto relative group">
          {imageLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Kép betöltése...</div>
            </div>
          ) : selectedImage ? (
            <div className="relative">
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => onNavigate("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Előző kép (←)"
                  >
                    <svg
                      className="w-8 h-8"
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
                    onClick={() => onNavigate("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Következő kép (→)"
                  >
                    <svg
                      className="w-8 h-8"
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
                </>
              )}

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

              <div className="mt-4 text-center">
                {report?.images && report.images.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    {report.images[currentIndex]?.filename}
                    <br />
                    <span className="text-xs text-gray-500">
                      {report.images[currentIndex]?.type?.toUpperCase()}
                    </span>
                  </div>
                )}

                {images.length > 1 && (
                  <div className="flex justify-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          onNavigate(index > currentIndex ? "next" : "prev")
                        }
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-[#236A75] scale-125 shadow-md"
                            : "bg-gray-400 hover:bg-gray-500 hover:scale-110"
                        }`}
                        title={`Kép ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
