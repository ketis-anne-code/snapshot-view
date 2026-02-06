import { useLocation } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const AdminFinal = () => {
  const location = useLocation();
  const { option = "written" } = (location.state as { option: string }) || {};
  const includesReview = option === "written-review";

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Kaikki on valmista
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Analyysi toimitetaan vahvistetulla tavalla.
      </p>

      <div className="p-5 bg-surface rounded-lg border border-border mb-4">
        <div className="text-sm text-muted-foreground mb-1">Kirjallinen analyysi</div>
        <div className="text-base font-medium text-foreground mb-3">
          Jaetaan kun valmis
        </div>
        <Button variant="outline" size="sm" disabled>
          Lataa (saatavilla pian)
        </Button>
      </div>

      {includesReview && (
        <div className="p-5 bg-surface rounded-lg border border-border mb-4">
          <div className="text-sm text-muted-foreground mb-1">Yhteinen läpikäynti</div>
          <div className="text-base font-medium text-foreground">
            Vahvistettu — saat kalenterikutsun
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-8 leading-relaxed">
        Analyysiä voi hyödyntää sellaisenaan tai jatkoyhteistyön pohjana.
      </p>
    </PageShell>
  );
};

export default AdminFinal;
