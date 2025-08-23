import React from "react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(autoCloseDelay);

  React.useEffect(() => {
    if (autoClose && onClose) {
      const interval = 100;

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - interval;
          if (newTime <= 0) {
            onClose();
            return 0;
          }
          return newTime;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const progressPercentage = autoClose
    ? (timeLeft / autoCloseDelay) * 100
    : 100;

  const getAlertClasses = () => {
    const basicClassNames =
      "relative p-4 rounded-lg border-l-4 shadow-md transition-all duration-300 ease-in-out overflow-hidden";

    switch (type) {
      case "success":
        return `${basicClassNames} bg-green-50 border-green-400 text-green-800`;
      case "error":
        return `${basicClassNames} bg-red-50 border-red-400 text-red-800`;
      case "warning":
        return `${basicClassNames} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case "info":
        return `${basicClassNames} bg-blue-50 border-blue-400 text-blue-800`;
      default:
        return `${basicClassNames} bg-gray-50 border-gray-400 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5";

    switch (type) {
      case "success":
        return (
          <svg
            className={`${iconClass} text-green-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return <img src="/error.svg" alt="Error" className={`${iconClass}`} />;
      case "warning":
        return (
          <svg
            className={`${iconClass} text-yellow-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={`${iconClass} text-blue-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getAlertClasses()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-75 transition-opacity"
              >
                <span className="sr-only">Bezárás</span>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {autoClose && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 h-1">
          <div
            className={`h-1 transition-all duration-100 ease-linear ${
              type === "success"
                ? "bg-green-400"
                : type === "error"
                  ? "bg-red-400"
                  : type === "warning"
                    ? "bg-yellow-400"
                    : "bg-blue-400"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Alert;
