import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { groupLabels, RespondentGroup } from "@/lib/survey-data";

const AdminStart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { group = "expert", target = 12 } = (location.state as {
    group: RespondentGroup;
    target: number;
  }) || {};

  const surveyLink = "https://kysely.ketaakatemia.fi/s/abc123";

  const reminderTemplate = `Hei — muistutuksena kyselystä, jonka voit täyttää kun ehdit. Se vie noin 5 minuuttia. Linkki: ${surveyLink}`;

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Kysely on valmis
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Yleiskuva siitä, mikä arjen työssä toimii hyvin ja mikä ei.
      </p>

      <div className="space-y-6 mb-10">
        <InfoRow label="Vastaajaryhmä" value={groupLabels[group]} />
        <InfoRow label="Tavoite" value={`${target} vastausta`} />
        <InfoRow label="Kysely auki" value="14 päivää" />
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-1">Analyysin tilaaminen</p>
          <p className="text-sm text-muted-foreground">
            Voit tilata analyysin kun vastauksia on tarpeeksi tai kyselyn määräaika on täyttynyt. Palaa tähän hallintanäkymään milloin tahansa tallentamasi linkin kautta.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <label className="text-sm font-medium text-foreground">Kyselylinkki</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground font-mono truncate">
            {surveyLink}
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => navigator.clipboard.writeText(surveyLink)}
          >
            Kopioi
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8 p-5 bg-surface rounded-lg border border-border">
        <h2 className="text-sm font-medium text-foreground">Näin jaat linkin</h2>
        <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li>Lähetä linkki vastaajille sähköpostilla tai viestillä.</li>
          <li>Jokainen vastaa kyselyyn itsenäisesti.</li>
          <li>Vastaajat eivät näe tuloksia tai muiden vastauksia.</li>
        </ul>
      </div>

      <div className="space-y-2 mb-10 p-5 bg-surface rounded-lg border border-border">
        <h2 className="text-sm font-medium text-foreground">Muistutusviesti</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {reminderTemplate}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary"
          onClick={() => navigator.clipboard.writeText(reminderTemplate)}
        >
          Kopioi muistutus
        </Button>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-1">Analyysin tilaaminen</p>
        <p className="text-sm text-muted-foreground">
          Voit tilata analyysin kun vastauksia on tarpeeksi tai kyselyn määräaika on täyttynyt. Palaa tähän hallintanäkymään milloin tahansa tallentamasi linkin kautta.
        </p>
      </div>

      <Button
        onClick={() => navigate("/admin/running", { state: { group, target } })}
        className="w-full py-6 text-base rounded-lg"
      >
        Näytä kyselyn tilanne
      </Button>
    </PageShell>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default AdminStart;
