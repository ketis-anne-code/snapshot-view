import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RespondentGroup, groupLabels } from "@/lib/survey-data";

const groups: { value: RespondentGroup; description: string }[] = [
  { value: "expert", description: "Ihmiset jotka tekevät käytännön työn" },
  { value: "manager", description: "Ihmiset jotka johtavat tiimejä ja koordinoivat" },
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
        Määritä kysely
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Valitse vastaajaryhmä ja osallistujamäärä.
      </p>

      <div className="space-y-3 mb-10">
        <label className="text-sm font-medium text-foreground">
          Vastaajaryhmä
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

      <div className="space-y-2 mb-12">
        <label className="text-sm font-medium text-foreground">
          Vastaajien lukumäärä
        </label>
        <Input
          type="number"
          min={1}
          max={25}
          placeholder="esim. 12"
          value={respondentCount}
          onChange={(e) => setRespondentCount(e.target.value)}
          className="max-w-[160px] bg-surface"
        />
        <p className="text-xs text-muted-foreground">
          Enintään 25 vastaajaa per kysely
        </p>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!isValid}
        className="w-full py-6 text-base rounded-lg"
      >
        Jatka
      </Button>
    </PageShell>
  );
};

export default BuyerOnboarding;
