import { cn } from "@/lib/utils";

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
  anchorLow?: string;
  anchorHigh?: string;
}

const ScaleInput = ({ value, onChange, anchorLow, anchorHigh }: ScaleInputProps) => {
  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 10 }, (_, i) => {
          const num = i + 1;
          const isSelected = value === num;
          return (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={cn(
                "w-11 h-11 rounded-lg text-sm font-medium transition-colors duration-150",
                "border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-foreground border-border hover:border-primary/40"
              )}
            >
              {num}
            </button>
          );
        })}
      </div>
      {(anchorLow || anchorHigh) && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
          <span>{anchorLow}</span>
          <span>{anchorHigh}</span>
        </div>
      )}
    </div>
  );
};

export default ScaleInput;
