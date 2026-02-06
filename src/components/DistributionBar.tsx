interface DistributionBarProps {
  /** Array of response values (1-10) */
  responses: number[];
}

const DistributionBar = ({ responses }: DistributionBarProps) => {
  if (responses.length === 0) return null;

  const sorted = [...responses].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];

  // Calculate percentages on the 1-10 scale
  const leftPct = ((min - 1) / 9) * 100;
  const widthPct = ((max - min) / 9) * 100;
  const medianPct = ((median - 1) / 9) * 100;

  return (
    <div className="space-y-3">
      {/* Scale numbers */}
      <div className="flex justify-between px-0">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="w-8 text-center text-sm text-muted-foreground"
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Bar */}
      <div className="relative h-10 bg-secondary rounded-md">
        {/* Distribution box */}
        <div
          className="absolute top-0 h-full bg-lilac-soft rounded-md border border-primary/20"
          style={{
            left: `${leftPct}%`,
            width: `${Math.max(widthPct, 3)}%`,
          }}
        />

        {/* Median line */}
        <div
          className="absolute top-0 h-full w-px bg-primary/50"
          style={{ left: `${medianPct}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 bg-lilac-soft rounded-sm border border-primary/20" />
          <span>Response spread</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-px h-3 bg-primary/50" />
          <span>Median</span>
        </div>
      </div>
    </div>
  );
};

export default DistributionBar;
