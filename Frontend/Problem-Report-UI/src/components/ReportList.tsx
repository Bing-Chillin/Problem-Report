export interface Report {
  date: string;
  id: string;
  imagePath: string;
  imageType: string;
  subSystem: string;
  text: string;
  status: string;
}

interface ReportListProps {
  reports: Report[];
  onDelete: (report: Report) => void;
  onToggleStatus: (report: Report) => void;
}

function ReportList({ reports, onDelete, onToggleStatus }: ReportListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100 px-4">
      {reports.map((report) => (
        <li
          key={report.id}
          className="flex justify-between gap-x-6 py-5 items-center"
        >
          {/* Left side (imagePath + date) */}
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">
                {report.imagePath}
              </p>
              <p className="mt-1 truncate text-xs text-gray-500">
                {report.date}
              </p>
            </div>
          </div>

          {/* Middle (text + status checkbox) */}
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-900">{report.text}</p>
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={report.status === "kész"}
                onChange={() => onToggleStatus(report)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded"
              />
              {report.status === "kész" ? "Kész" : "Nyitott"}
            </label>
          </div>

          {/* Right (delete button) */}
          <div>
            <button
              onClick={() => onDelete(report)}
              className="text-red-500 hover:bg-red-500 hover:text-white rounded-full px-2 py-2 border border-red-500"
            >
              Törlés
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ReportList;
