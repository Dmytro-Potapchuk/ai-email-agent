import { useQuery } from "@tanstack/react-query";
import { getJobs, type Job } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Mail, Clock, AlertCircle, Loader2 } from "lucide-react";

interface JobListProps {
  onSelectJob: (job: Job) => void;
  selectedJobId?: string;
}

export function JobList({ onSelectJob, selectedJobId }: JobListProps) {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Ładowanie...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Nie udało się pobrać jobów. Sprawdź czy backend działa na localhost:3000.
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Mail className="mb-3 h-10 w-10 opacity-30" />
        <p className="text-sm">Brak jobów</p>
        <p className="text-xs opacity-60">Utwórz pierwszy email powyżej</p>
      </div>
    );
  }

  const sorted = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-1">
      {sorted.map((job) => (
        <button
          key={job._id}
          onClick={() => onSelectJob(job)}
          className={`w-full text-left rounded-lg border p-3 transition-all hover:bg-accent/50 ${
            selectedJobId === job._id
              ? "border-primary/40 bg-accent"
              : "border-transparent"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{job.prompt}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{job.recipient}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: pl })}
          </div>
        </button>
      ))}
    </div>
  );
}
