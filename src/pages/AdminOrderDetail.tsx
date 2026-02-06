import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { groupLabels } from "@/lib/survey-data";
import { toast } from "@/hooks/use-toast";

const AdminOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [order, setOrder] = useState<{ group_type: string; target_n: number } | null>(null);
  const [survey, setSurvey] = useState<{ id: string; share_token: string; closes_at: string } | null>(null);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    if (!session || !orderId) return;

    const load = async () => {
      // Check access
      const { data: access } = await supabase
        .from("order_access")
        .select("id")
        .eq("order_id", orderId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!access) {
        setHasAccess(false);
        return;
      }
      setHasAccess(true);

      // Fetch order
      const { data: o } = await supabase
        .from("orders")
        .select("group_type, target_n")
        .eq("id", orderId)
        .maybeSingle();
      setOrder(o);

      // Fetch survey
      const { data: s } = await supabase
        .from("surveys")
        .select("id, share_token, closes_at")
        .eq("order_id", orderId)
        .maybeSingle();
      setSurvey(s);

      // Response count
      const { data: count } = await supabase.rpc("get_admin_response_count", {
        p_order_id: orderId,
      });
      setResponseCount((count as number) ?? 0);
    };

    load();
  }, [session, orderId]);

  if (loading) return null;
  if (!session) return <Navigate to="/admin/sign-in" replace />;
  if (hasAccess === false) return <Navigate to="/admin" replace />;

  const formatDate = (iso: string) => {
    if (!iso) return "–";
    const d = new Date(iso);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  const shareLink = survey
    ? `${window.location.origin}/s/${survey.share_token}`
    : "";

  const closesFormatted = survey ? formatDate(survey.closes_at) : "–";

  const reminderText = `Hei,\n\nMuistathan vastata kyselyyn ennen ${closesFormatted}.\n\nLinkki kyselyyn: ${shareLink}\n\nKiitos!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reminderText);
      toast({ title: "Kopioitu leikepöydälle" });
    } catch {
      toast({ title: "Kopiointi epäonnistui", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/sign-in", { replace: true });
  };

  if (hasAccess === null) {
    return (
      <PageShell>
        <Logo />
        <p className="text-sm text-muted-foreground">Ladataan…</p>
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
        onClick={() => navigate("/admin")}
        className="mb-6 text-sm text-muted-foreground -ml-2"
      >
        ← Takaisin
      </Button>

      <h1 className="text-2xl font-semibold text-foreground mb-8">
        {order ? (groupLabels[order.group_type as keyof typeof groupLabels] ?? order.group_type) : "–"}
      </h1>

      <div className="space-y-4 mb-8">
        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Tavoite</p>
          <p className="text-lg font-medium text-foreground">{order?.target_n ?? "–"} vastaajaa</p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Vastauksia</p>
          <p className="text-lg font-medium text-foreground">
            {responseCount} / {order?.target_n ?? "–"}
          </p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Kysely sulkeutuu</p>
          <p className="text-lg font-medium text-foreground">{closesFormatted}</p>
        </div>

        <div className="p-5 bg-surface rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Jakolinkki</p>
          <p className="text-sm font-mono text-foreground break-all">{shareLink || "–"}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-3">Muistutusviesti</h2>
        <Textarea
          readOnly
          value={reminderText}
          className="mb-3 min-h-[140px] text-sm"
        />
        <Button variant="outline" onClick={copyToClipboard} className="w-full py-5 text-base rounded-lg">
          Kopioi viesti
        </Button>
      </div>

      <div className="p-5 bg-lilac-soft rounded-lg border border-border mb-8">
        <p className="text-sm text-foreground">
          Kooste vastauksista on saatavilla, kun kysely on sulkeutunut. Yksittäisiä vastauksia ei näytetä.
        </p>
      </div>

      {survey && (
        <Button
          onClick={() => navigate(`/admin/results/${survey.id}`)}
          className="w-full py-6 text-base rounded-lg"
        >
          Näytä tulokset
        </Button>
      )}
    </PageShell>
  );
};

export default AdminOrderDetail;
