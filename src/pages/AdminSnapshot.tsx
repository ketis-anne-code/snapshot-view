import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import StatusDot from "@/components/StatusDot";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { groupLabels } from "@/lib/survey-data";

type AdminSurveyStatus = {
  survey_id: string;
  order_id: string;
  group_type: string;
  target_n: number;
  opens_at: string | null;
  closes_at: string | null;
  responses_count: number;
  data_state: "red" | "yellow" | "green";
};

const dataStateMap = {
  red: "limited",
  yellow: "indicative",
  green: "sufficient",
} as const;

const dataStateLabel = {
  red: "Ei vielä vastauksia",
  yellow: "Kertyy",
  green: "Tavoite saavutettu",
} as const;

const formatDate = (iso: string | null) => {
  if (!iso) return "–";
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const AdminSnapshot = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<AdminSurveyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || !surveyId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      const { data: row, error: err } = await (supabase.rpc as any)(
        "get_admin_survey_status_v2",
        { p_survey_id: surveyId }
      ).single();

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setData(null);
      } else {
        setData(row as AdminSurveyStatus);
      }
      setLoading(false);
    };

    run();
    return () => { cancelled = true; };
  }, [session, surveyId]);

  if (authLoading) return null;
  if (!session) return <Navigate to="/admin/sign-in" replace />;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/sign-in", { replace: true });
  };

  if (loading) {
    return (
      <PageShell>
        <Logo />
        <p className="text-sm text-muted-foreground">Ladataan…</p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <Logo />
        <p className="text-sm text-destructive">
          {error || "Ei oikeuksia tai kyselyä ei löytynyt."}
        </p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4 text-sm text-muted-foreground">
          ← Takaisin
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-12">
        <Logo />
        <Button variant="ghost" onClick={handleSignOut} className="text-sm text-muted-foreground">
          Kirjaudu ulos
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-muted-foreground -ml-2"
      >
        ← Takaisin
      </Button>

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Tilannekuva
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        {groupLabels[data.group_type as keyof typeof groupLabels] ?? data.group_type}
      </p>

      <div className="space-y-4 mb-10">
        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Vastauksia</p>
          <p className="text-lg font-medium text-foreground">
            {data.responses_count} / {data.target_n}
          </p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Aineiston tila</p>
          <StatusDot
            status={dataStateMap[data.data_state]}
            label={dataStateLabel[data.data_state]}
          />
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Kysely sulkeutuu</p>
          <p className="text-lg font-medium text-foreground">
            {formatDate(data.closes_at)}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Tämä on tilannetieto, ei analyysi.
      </p>
    </PageShell>
  );
};

export default AdminSnapshot;
