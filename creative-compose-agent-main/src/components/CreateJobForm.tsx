import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, createJobSchema, type CreateJobInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";

export function CreateJobForm() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { prompt: "", recipient: "" },
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      toast.success(`Job utworzony (${data.id})`);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      form.reset();
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Nie udało się utworzyć joba");
    },
  });

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="glow-primary">
        <Sparkles className="mr-2 h-4 w-4" />
        Nowy Email
      </Button>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="rounded-lg border border-border bg-card p-4 space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Adresat</label>
        <Input
          placeholder="email@example.com"
          className="font-mono bg-secondary border-border"
          {...form.register("recipient")}
        />
        {form.formState.errors.recipient && (
          <p className="text-xs text-destructive">{form.formState.errors.recipient.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Prompt</label>
        <Textarea
          placeholder="Opisz treść emaila, którą chcesz wygenerować..."
          className="min-h-[100px] bg-secondary border-border resize-none"
          {...form.register("prompt")}
        />
        {form.formState.errors.prompt && (
          <p className="text-xs text-destructive">{form.formState.errors.prompt.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending} className="glow-primary">
          <Send className="mr-2 h-4 w-4" />
          {mutation.isPending ? "Wysyłanie..." : "Wyślij"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => { setIsOpen(false); form.reset(); }}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
