import { useQuery } from "@tanstack/react-query";
import { getJob, type Job } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Mail, FileText, AlertTriangle, Clock } from "lucide-react";

export function JobDetail({ jobId }: { jobId: string }) {
  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "sent" || status === "failed") return false;
      return 3000;
    },
  });

  if (!job) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Szczegóły joba</h2>
        <StatusBadge status={job.status} />
      </div>

      <div className="space-y-4">
        <InfoRow icon={Mail} label="Adresat" value={job.recipient} mono />
        <InfoRow icon={Clock} label="Utworzono" value={format(new Date(job.createdAt), "dd MMM yyyy, HH:mm", { locale: pl })} />
        <InfoRow icon={FileText} label="Prompt" value={job.prompt} />

        {job.generatedContent && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wygenerowana treść</p>
            <div className="rounded-lg border border-border bg-secondary p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {job.generatedContent}
            </div>
          </div>
        )}

        {job.error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {job.error}
          </div>
        )}

        <p className="font-mono text-[10px] text-muted-foreground/40 select-all">{job._id}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
