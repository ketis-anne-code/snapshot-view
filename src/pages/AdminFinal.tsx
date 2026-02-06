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
        Everything is set
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Your analysis will be delivered as confirmed.
      </p>

      {/* Written analysis */}
      <div className="p-5 bg-surface rounded-lg border border-border mb-4">
        <div className="text-sm text-muted-foreground mb-1">Written analysis</div>
        <div className="text-base font-medium text-foreground mb-3">
          Will be shared when ready
        </div>
        <Button variant="outline" size="sm" disabled>
          Download (available soon)
        </Button>
      </div>

      {/* Joint review confirmation */}
      {includesReview && (
        <div className="p-5 bg-surface rounded-lg border border-border mb-4">
          <div className="text-sm text-muted-foreground mb-1">Joint review session</div>
          <div className="text-base font-medium text-foreground">
            Confirmed — you'll receive a calendar invite
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-8 leading-relaxed">
        The analysis can be used with or without further collaboration.
      </p>
    </PageShell>
  );
};

export default AdminFinal;
