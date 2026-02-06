import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "sufficient" | "indicative" | "limited";
  label: string;
}

const statusColors = {
  sufficient: "bg-status-sufficient",
  indicative: "bg-status-indicative",
  limited: "bg-status-limited",
};

const StatusDot = ({ status, label }: StatusDotProps) => (
  <div className="flex items-center gap-2.5">
    <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[status])} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

export default StatusDot;
