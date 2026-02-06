import { cn } from "@/lib/utils";

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

const ScaleInput = ({ value, onChange }: ScaleInputProps) => {
  return (
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
  );
};

export default ScaleInput;
