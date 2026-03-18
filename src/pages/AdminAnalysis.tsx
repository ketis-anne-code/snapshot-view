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
  const formattedDate = deliveryDate.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const options: { value: AnalysisOption; title: string; desc: string }[] = [
    {
      value: "written",
      title: "Kirjallinen analyysi",
      desc: "Yksityiskohtainen kirjallinen katsaus toimitettuna sinulle.",
    },
    {
      value: "written-review",
      title: "Kirjallinen analyysi + yhteinen läpikäynti",
      desc: "Kirjallinen katsaus ja tapaaminen, jossa käydään havainnot yhdessä läpi.",
    },
  ];

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Analyysi käynnissä
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Kirjallinen analyysi toimitetaan 7 arkipäivän kuluessa.
      </p>

      <div className="p-5 bg-surface rounded-lg border border-border mb-8">
        <div className="text-sm text-muted-foreground mb-1">
          Arvioitu toimituspäivä
        </div>
        <div className="text-lg font-medium text-foreground">
          {formattedDate}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <label className="text-sm font-medium text-foreground">
          Valitse toimitustapa
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

      {selected === "written-review" && (
        <div className="p-5 bg-surface rounded-lg border border-border mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            Varaa aika yhteiselle läpikäynnille
          </p>
          <href="https://calendar.app.google/jKPiaLFbe1RqL7At9"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full py-4 flex items-center justify-center rounded-md border border-border bg-surface text-sm font-medium text-primary hover:bg-lilac-soft transition-colors"
>
  Varaa aika läpikäynnille →
</a>
        </div>
      )}

      <Button
        onClick={() => navigate("/admin/final", { state: { option: selected } })}
        className="w-full py-6 text-base rounded-lg"
      >
        Vahvista
      </Button>
    </PageShell>
  );
};

export default AdminAnalysis;
