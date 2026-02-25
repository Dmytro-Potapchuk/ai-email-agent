import { useState } from "react";
import { CreateJobForm } from "@/components/CreateJobForm";
import { JobList } from "@/components/JobList";
import { JobDetail } from "@/components/JobDetail";
import type { Job } from "@/lib/api";
import { Zap } from "lucide-react";

const Index = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold leading-none">AI Email Agent</h1>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono">localhost:3000</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 p-6">
        {/* Left Panel */}
        <div className="w-full max-w-md space-y-4">
          <CreateJobForm />
          <JobList onSelectJob={setSelectedJob} selectedJobId={selectedJob?._id} />
        </div>

        {/* Right Panel */}
        <div className="flex-1 rounded-lg border border-border bg-card p-6">
          {selectedJob ? (
            <JobDetail jobId={selectedJob._id} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground/40">
              <Zap className="mb-3 h-12 w-12" />
              <p className="text-sm">Wybierz job z listy</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
