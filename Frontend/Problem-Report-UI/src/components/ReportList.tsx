export interface Report {
  id: string;
  subSystem: string;
  text: string;
  imagePath: string;
  imageType: string;
  date: string;
  status: string;
  sender: string;
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
          className="flex justify-between gap-x-6 py-5 items-center border-b"
        >
          {/* Left - Subsystem, Sender, Date */}
          <div className="flex flex-col text-sm text-gray-700 w-1/4">
            <span className="font-semibold">{report.subSystem}</span>
            <span>{report.sender}</span>
            <span className="text-xs text-gray-500">{report.date}</span>
          </div>

          {/* Middle - Text */}
          <div className="text-sm text-gray-900 truncate w-2/4">
            {report.text}
          </div>

          {/* Right - Status & Delete */}
          <div className="flex flex-col items-end w-1/4 gap-y-2">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={report.status === "lezárt"}
                onChange={() => onToggleStatus(report)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded"
              />
              {report.status === "lezárt" ? "Lezárt" : "Nyitott"}
            </label>
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
  );
}

export default ReportList;
