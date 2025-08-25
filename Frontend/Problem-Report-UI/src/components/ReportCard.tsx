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

interface ReportCardProps {
  report: Report;
  onReportClick: (report: Report) => void;
  onImageClick: (reportId: number, imageIndex: number) => void;
  imageLoading: boolean;
}

export default function ReportCard({
  report,
  onReportClick,
  onImageClick,
  imageLoading,
}: ReportCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 cursor-pointer group"
      onClick={() => onReportClick(report)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#236A75] to-[#0E3F47] text-white px-3 py-1 rounded-full text-sm font-semibold">
              #{report.id}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${statusColors[report.status] || "bg-gray-500"}`}
                title={statusLabels[report.status] || report.status}
              />
              <span className="text-sm font-medium text-gray-700">
                {statusLabels[report.status] || report.status}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(report.date).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {(report.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {report.name || "Ismeretlen felhasználó"}
                </div>
                <div className="text-xs text-gray-500">{report.email}</div>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {subsystemLabels[report.subsystem] ?? report.subsystem}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#236A75]">
            <p
              className="text-gray-800 text-sm leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {report.text}
            </p>
          </div>

          {((report.images && report.images.length > 0) ||
            report.imagePath) && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-gray-600">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  {report.images && report.images.length > 0
                    ? `${report.images.length} mellékelt kép`
                    : "1 mellékelt kép"}
                </span>
              </div>

              {report.images && report.images.length > 0 ? (
                <div className="flex gap-1">
                  {report.images.slice(0, 4).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick(report.id, index);
                      }}
                      className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
                      disabled={imageLoading}
                      title={`${image.type?.toUpperCase()} - ${image.filename}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  {report.images.length > 4 && (
                    <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg text-xs flex items-center justify-center">
                      +{report.images.length - 4}
                    </div>
                  )}
                </div>
              ) : (
                report.imagePath && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick(report.id, 0);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                    disabled={imageLoading}
                  >
                    📷 Kép megtekintése
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <div className="text-xs text-gray-400 group-hover:text-[#236A75] transition-colors">
            Kattints a részletekért →
          </div>
        </div>
      </div>
    </div>
  );
}
