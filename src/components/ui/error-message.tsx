import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  action?: React.ReactNode;
}

export function ErrorMessage({ message, className, action }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-red-50 p-4",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Si è verificato un errore</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
} 