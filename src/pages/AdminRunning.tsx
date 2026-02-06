import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import StatusDot from "@/components/StatusDot";
import {
  groupLabels,
  RespondentGroup,
  getResponseStatus,
  getStatusLabel,
} from "@/lib/survey-data";

const AdminRunning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { group = "expert", target = 12 } = (location.state as {
    group: RespondentGroup;
    target: number;
  }) || {};

  const collected = 8;
  const daysRemaining = 9;
  const status = getResponseStatus(collected, target);

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Kysely käynnissä
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        {groupLabels[group]}
      </p>

      <div className="p-6 bg-surface rounded-lg border border-border mb-6">
        <div className="text-4xl font-semibold text-foreground mb-1">
          {collected}
          <span className="text-lg text-muted-foreground font-normal"> / {target}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Vastauksia kerätty</p>
        <StatusDot status={status} label={getStatusLabel(status)} />
      </div>

      <div className="p-6 bg-surface rounded-lg border border-border mb-10">
        <div className="text-2xl font-semibold text-foreground mb-1">
          {daysRemaining} päivää
        </div>
        <p className="text-sm text-muted-foreground">Aikaa jäljellä ennen kyselyn sulkeutumista</p>
      </div>

      <Button
        onClick={() =>
          navigate("/admin/snapshot", { state: { group, target, collected } })
        }
        variant="outline"
        className="w-full py-6 text-base rounded-lg"
      >
        Esikatsele tilannekuvaa
      </Button>
    </PageShell>
  );
};

export default AdminRunning;
