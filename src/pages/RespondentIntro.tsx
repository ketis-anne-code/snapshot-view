import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const RespondentIntro = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Logo />

      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Ennen kuin aloitat
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-4">
          Tämän kyselyn tarkoitus on muodostaa yleiskuva siitä, mikä arjen työssä toimii ja mikä ei.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Vastaukset käsitellään kokonaiskuvana eikä niitä voida yhdistää yksittäisiin henkilöihin.
        </p>
      </div>

      <Button
        onClick={() => navigate("/survey/questions")}
        className="w-full py-6 text-base rounded-lg"
      >
        Aloita kysely
      </Button>
    </PageShell>
  );
};

export default RespondentIntro;
