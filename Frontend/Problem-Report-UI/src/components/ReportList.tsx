interface Report {
  date: string;
  id: string;
  imagePath: string;
  imageType: string;
  subSystem: string;
  text: string;
  status: string;
}

function ReportList({ reports }: { reports: Report[] }) {
  return (
    <ul role="list" className="divide-y divide-gray-100 px-4">
      {reports.map((report) => (
        <li key={report.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                {report.imagePath}
              </p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">
                {report.date}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-gray-900">{report.text}</p>
            <p className="mt-1 text-xs/5 text-gray-500">{report.status}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ReportList;
