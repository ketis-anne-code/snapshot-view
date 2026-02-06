interface DistributionSparklineProps {
  /** Array of 10 counts for buckets 1–10 */
  buckets: number[];
  questionLabel: string;
}

const BLOCKS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

const DistributionSparkline = ({ buckets, questionLabel }: DistributionSparklineProps) => {
  const max = Math.max(...buckets, 1);

  const toBlock = (n: number) => {
    if (n === 0) return "▁";
    const idx = Math.round((n / max) * (BLOCKS.length - 1));
    return BLOCKS[idx];
  };

  return (
    <div className="p-5 bg-surface rounded-lg border border-border">
      <p className="text-sm font-medium text-foreground mb-3">{questionLabel}</p>

      <div className="flex justify-between px-0 mb-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="w-8 text-center text-xs text-muted-foreground">
            {i + 1}
          </span>
        ))}
      </div>

      <div className="flex justify-between px-0 font-mono text-lg leading-none text-primary">
        {buckets.map((n, i) => (
          <span key={i} className="w-8 text-center" title={`${n} vastausta`}>
            {toBlock(n)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DistributionSparkline;
