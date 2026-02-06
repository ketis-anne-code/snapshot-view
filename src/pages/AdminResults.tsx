import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { groupLabels, surveyQuestions } from "@/lib/survey-data";
import DistributionSparkline from "@/components/DistributionSparkline";

interface SurveyStatus {
  survey_id: string;
  order_id: string;
  group_type: string;
  target_n: number;
  opens_at: string;
  closes_at: string;
  responses_count: number;
  data_state: string;
}

const dataStateEmoji: Record<string, string> = {
  red: "🔴",
  yellow: "🟡",
  green: "🟢",
};

const dataStateLabel: Record<string, string> = {
  red: "Rajallinen aineisto",
  yellow: "Suuntaa antava",
  green: "Riittävä aineisto",
};

const AdminResults = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState<SurveyStatus | null>(null);
  const [distributions, setDistributions] = useState<Map<string, number[]>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!session || !surveyId) return;

    const load = async () => {
      try {
        // Fetch survey status
        const { data: statusRows, error: statusErr } = await supabase.rpc(
          "get_admin_survey_status",
          { p_survey_id: surveyId }
        );

        if (statusErr) throw statusErr;

        if (!statusRows || statusRows.length === 0) {
          setError("Ei oikeuksia tai kyselyä ei löytynyt.");
          setFetching(false);
          return;
        }

        setStatus(statusRows[0] as SurveyStatus);

        // Fetch distribution
        const { data: distRows, error: distErr } = await supabase.rpc(
          "get_admin_distribution",
          { p_survey_id: surveyId }
        );

        if (distErr) throw distErr;

        // Build map: question_key -> number[10]
        const map = new Map<string, number[]>();
        for (const row of distRows ?? []) {
          const key = row.question_key as string;
          if (!map.has(key)) {
            map.set(key, new Array(10).fill(0));
          }
          const bucket = (row.bucket as number) - 1; // 0-indexed
          if (bucket >= 0 && bucket < 10) {
            map.get(key)![bucket] = Number(row.n);
          }
        }
        setDistributions(map);
      } catch (err: any) {
        setError(err.message ?? "Virhe ladattaessa tietoja.");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [session, surveyId]);

  if (loading) return null;
  if (!session) return <Navigate to="/admin/sign-in" replace />;

  const formatDate = (iso: string) => {
    if (!iso) return "–";
    const d = new Date(iso);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/sign-in", { replace: true });
  };

  if (fetching) {
    return (
      <PageShell>
        <Logo />
        <p className="text-sm text-muted-foreground">Ladataan…</p>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <Logo />
        <div className="p-6 bg-surface rounded-lg border border-border text-center mt-8">
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mt-6 text-sm text-muted-foreground"
        >
          ← Takaisin
        </Button>
      </PageShell>
    );
  }

  const groupName = status
    ? groupLabels[status.group_type as keyof typeof groupLabels] ?? status.group_type
    : "–";

  // Build ordered question keys matching surveyQuestions
  const questionKeys = surveyQuestions.map((_, i) => `q${i + 1}`);

  return (
    <PageShell maxWidth="lg">
      <div className="flex items-center justify-between mb-12">
        <Logo />
        <Button variant="ghost" onClick={handleSignOut} className="text-sm text-muted-foreground">
          Kirjaudu ulos
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate(status ? `/admin/order/${status.order_id}` : "/admin")}
        className="mb-6 text-sm text-muted-foreground -ml-2"
      >
        ← Takaisin
      </Button>

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Tulokset – {groupName}
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Vastausten jakautuminen kysymyksittäin.
      </p>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Vastauksia</p>
          <p className="text-lg font-medium text-foreground">
            {status!.responses_count} / {status!.target_n}
          </p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Aineiston tila</p>
          <p className="text-lg font-medium text-foreground">
            {dataStateEmoji[status!.data_state] ?? ""}{" "}
            {dataStateLabel[status!.data_state] ?? status!.data_state}
          </p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Kysely sulkeutuu</p>
          <p className="text-lg font-medium text-foreground">
            {formatDate(status!.closes_at)}
          </p>
        </div>
      </div>

      {/* Distribution sparklines */}
      {distributions.size === 0 ? (
        <div className="p-6 bg-surface rounded-lg border border-border text-center">
          <p className="text-muted-foreground">Ei vielä vastauksia näytettäväksi.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questionKeys.map((qKey, i) => {
            const buckets = distributions.get(qKey);
            if (!buckets) return null;
            return (
              <DistributionSparkline
                key={qKey}
                buckets={buckets}
                questionLabel={surveyQuestions[i]?.text ?? qKey}
              />
            );
          })}
        </div>
      )}

      <div className="p-5 bg-lilac-soft rounded-lg border border-border mt-10">
        <p className="text-sm text-foreground">
          Tämä näkymä näyttää vastausten jakautumisen. Yksittäisiä vastauksia ei näytetä.
        </p>
      </div>
    </PageShell>
  );
};

export default AdminResults;
