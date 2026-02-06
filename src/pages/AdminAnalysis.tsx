import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addBusinessDays } from "@/lib/survey-data";

type AnalysisOption = "written" | "written-review";

const AdminAnalysis = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AnalysisOption>("written");

  const deliveryDate = addBusinessDays(new Date(), 7);
  const formattedDate = deliveryDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const options: { value: AnalysisOption; title: string; desc: string }[] = [
    {
      value: "written",
      title: "Written analysis only",
      desc: "A detailed written overview delivered to you.",
    },
    {
      value: "written-review",
      title: "Written analysis + joint review",
      desc: "Written overview plus a session to walk through findings together.",
    },
  ];

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Analysis in progress
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Written analysis will be delivered within 7 business days.
      </p>

      <div className="p-5 bg-surface rounded-lg border border-border mb-8">
        <div className="text-sm text-muted-foreground mb-1">
          Expected delivery
        </div>
        <div className="text-lg font-medium text-foreground">
          {formattedDate}
        </div>
      </div>

      {/* Delivery options */}
      <div className="space-y-3 mb-8">
        <label className="text-sm font-medium text-foreground">
          Choose your delivery
        </label>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={cn(
              "w-full text-left px-5 py-4 rounded-lg border transition-colors duration-150",
              selected === opt.value
                ? "border-primary bg-lilac-soft"
                : "border-border bg-surface hover:border-primary/30"
            )}
          >
            <div className="font-medium text-foreground">{opt.title}</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {opt.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Calendar placeholder */}
      {selected === "written-review" && (
        <div className="p-5 bg-surface rounded-lg border border-border mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            Book a time for the joint review session
          </p>
          <div className="h-32 rounded-md border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
            Calendar booking will appear here
          </div>
        </div>
      )}

      <Button
        onClick={() => navigate("/admin/final", { state: { option: selected } })}
        className="w-full py-6 text-base rounded-lg"
      >
        Confirm
      </Button>
    </PageShell>
  );
};

export default AdminAnalysis;
