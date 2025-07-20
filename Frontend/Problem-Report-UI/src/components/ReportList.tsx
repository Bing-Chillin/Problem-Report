export interface Report {
  id: string;
  subSystem: string;
  text: string;
  imagePath: string;
  imageType: string;
  date: string;
  status: string;
  name: string;
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
  if (access) {
    return (
      <ul role="list" className="divide-y divide-gray-100 px-4">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex justify-between gap-x-6 py-5 items-center border-b"
          >
            {/* Left - Subsystem, Sender, Date */}
            <div className="flex flex-col text-sm text-gray-700 w-1/4">
              <span className="font-semibold">{report.name}</span>
              <span>
                {subsystemLabels[report.subSystem] ?? report.subSystem}
              </span>
              <span className="text-xs text-gray-500">{report.date}</span>
            </div>

            {/* Middle - Text */}
            <div className="text-sm text-gray-900 truncate w-2/4">
              {report.text}
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
    );
  } else {
    return <h1>hozzaferes megtagadva</h1>;
  }
}

export default ReportList;
