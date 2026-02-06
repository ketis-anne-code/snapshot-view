import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RespondentGroup, groupLabels } from "@/lib/survey-data";

const groups: { value: RespondentGroup; description: string }[] = [
  { value: "expert", description: "People who do the hands-on work" },
  { value: "manager", description: "People who lead teams and coordinate" },
  { value: "executive", description: "People who set direction and priorities" },
];

const BuyerOnboarding = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<RespondentGroup | null>(null);
  const [respondentCount, setRespondentCount] = useState<string>("");

  const count = parseInt(respondentCount);
  const isValid = selectedGroup && count >= 1 && count <= 25;

  const handleContinue = () => {
    if (isValid) {
      navigate("/admin/start", {
        state: { group: selectedGroup, target: count },
      });
    }
  };

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Set up your survey
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Select who will be responding and how many people to include.
      </p>

      {/* Group selection */}
      <div className="space-y-3 mb-10">
        <label className="text-sm font-medium text-foreground">
          Respondent group
        </label>
        {groups.map((g) => (
          <button
            key={g.value}
            onClick={() => setSelectedGroup(g.value)}
            className={cn(
              "w-full text-left px-5 py-4 rounded-lg border transition-colors duration-150",
              selectedGroup === g.value
                ? "border-primary bg-lilac-soft"
                : "border-border bg-surface hover:border-primary/30"
            )}
          >
            <div className="font-medium text-foreground">
              {groupLabels[g.value]}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {g.description}
            </div>
          </button>
        ))}
      </div>

      {/* Respondent count */}
      <div className="space-y-2 mb-12">
        <label className="text-sm font-medium text-foreground">
          Number of respondents
        </label>
        <Input
          type="number"
          min={1}
          max={25}
          placeholder="e.g. 12"
          value={respondentCount}
          onChange={(e) => setRespondentCount(e.target.value)}
          className="max-w-[160px] bg-surface"
        />
        <p className="text-xs text-muted-foreground">
          Maximum 25 respondents per survey
        </p>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!isValid}
        className="w-full py-6 text-base rounded-lg"
      >
        Continue
      </Button>
    </PageShell>
  );
};

export default BuyerOnboarding;
