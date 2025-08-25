import { useState, useEffect } from "react";
import type { Report } from "./ReportList";

interface FilterPanelProps {
  reports: Report[];
  onFilteredReportsChange: (filteredReports: Report[]) => void;
}

export default function FilterPanel({
  reports,
  onFilteredReportsChange,
}: FilterPanelProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subsystemFilter, setSubsystemFilter] = useState<string>("all");

  const applyFilters = (
    newSortOrder?: "asc" | "desc",
    newStatusFilter?: string,
    newSubsystemFilter?: string,
  ) => {
    const currentSortOrder = newSortOrder ?? sortOrder;
    const currentStatusFilter = newStatusFilter ?? statusFilter;
    const currentSubsystemFilter = newSubsystemFilter ?? subsystemFilter;

    const filteredAndSortedReports = reports
      .filter((report) => {
        const statusMatch =
          currentStatusFilter === "all" ||
          report.status === currentStatusFilter;
        const subsystemMatch =
          currentSubsystemFilter === "all" ||
          report.subsystem === currentSubsystemFilter;
        return statusMatch && subsystemMatch;
      })
      .sort((a, b) => {
        const dateComparison =
          new Date(a.date).getTime() - new Date(b.date).getTime();
        return currentSortOrder === "asc" ? dateComparison : -dateComparison;
      });

    onFilteredReportsChange(filteredAndSortedReports);
  };

  useEffect(() => {
    applyFilters();
  }, [reports, sortOrder, statusFilter, subsystemFilter]);

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSubsystemFilterChange = (value: string) => {
    setSubsystemFilter(value);
  };

  const handleReset = () => {
    setSortOrder("desc");
    setStatusFilter("all");
    setSubsystemFilter("all");
  };

  const filteredCount = reports.filter((report) => {
    const statusMatch =
      statusFilter === "all" || report.status === statusFilter;
    const subsystemMatch =
      subsystemFilter === "all" || report.subsystem === subsystemFilter;
    return statusMatch && subsystemMatch;
  }).length;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#236A75] to-[#0E3F47] rounded-lg flex items-center justify-center shadow-sm">
            <img
              src="/filter.png"
              alt="Filter"
              className="w-4 h-4 brightness-0 invert"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Szűrők</h3>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-all duration-200 group-hover:text-[#236A75] ${
            isFilterOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isFilterOpen && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Állapot
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236A75] focus:border-[#236A75] transition-all"
              >
                <option value="all">Mind</option>
                <option value="nyitott">Nyitott</option>
                <option value="folyamatban">Folyamatban</option>
                <option value="lezárt">Lezárt</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Alrendszer
              </label>
              <select
                value={subsystemFilter}
                onChange={(e) => handleSubsystemFilterChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236A75] focus:border-[#236A75] transition-all"
              >
                <option value="all">Mind</option>
                <option value="Cemetery">Temető</option>
                <option value="CityMaintenance">Városüzemeltetés</option>
                <option value="TaskManagement">Feladatkezelés</option>
                <option value="ProblemReport">Hibabejelentő</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Dátum rendezés:
              </span>
              <button
                onClick={handleSortOrderChange}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  sortOrder === "desc"
                    ? "bg-[#236A75] text-white shadow-sm"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {sortOrder === "desc" ? (
                  <>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Legújabb először
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    Legrégebbi először
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {filteredCount} találat
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-medium text-gray-500 hover:text-[#236A75] transition-colors"
              >
                Visszaállítás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
