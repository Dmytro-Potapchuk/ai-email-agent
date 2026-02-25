import type { JobStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  pending: { label: "Oczekuje", className: "bg-status-pending/15 text-status-pending glow-status-pending" },
  processing: { label: "Przetwarzanie", className: "bg-status-processing/15 text-status-processing glow-status-processing" },
  generated: { label: "Wygenerowano", className: "bg-status-generated/15 text-status-generated glow-status-generated" },
  sent: { label: "Wysłano", className: "bg-status-sent/15 text-status-sent glow-status-sent" },
  failed: { label: "Błąd", className: "bg-status-failed/15 text-status-failed glow-status-failed" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium", config.className)}>
      {config.label}
    </span>
  );
}
