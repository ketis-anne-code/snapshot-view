import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { groupLabels } from "@/lib/survey-data";

interface OrderRow {
  id: string;
  group_type: string;
  target_n: number;
  closes_at: string;
  responseCount: number;
}

const AdminDashboard = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      // Get order IDs user has access to
      const { data: accessRows } = await supabase
        .from("order_access")
        .select("order_id")
        .eq("user_id", session.user.id);

      if (!accessRows || accessRows.length === 0) {
        setFetching(false);
        return;
      }

      const orderIds = accessRows.map((r) => r.order_id);

      // Get orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, group_type, target_n")
        .in("id", orderIds);

      // Get surveys for closes_at
      const { data: surveysData } = await supabase
        .from("surveys")
        .select("order_id, closes_at")
        .in("order_id", orderIds);

      // Get response counts via RPC
      const counts = await Promise.all(
        orderIds.map(async (oid) => {
          const { data } = await supabase.rpc("get_admin_response_count", {
            p_order_id: oid,
          });
          return { order_id: oid, count: (data as number) ?? 0 };
        })
      );

      const surveyMap = new Map(
        (surveysData ?? []).map((s) => [s.order_id, s.closes_at])
      );
      const countMap = new Map(
        counts.map((c) => [c.order_id, c.count])
      );

      const merged: OrderRow[] = (ordersData ?? []).map((o) => ({
        id: o.id,
        group_type: o.group_type,
        target_n: o.target_n,
        closes_at: surveyMap.get(o.id) ?? "",
        responseCount: countMap.get(o.id) ?? 0,
      }));

      setOrders(merged);
      setFetching(false);
    };

    fetchOrders();
  }, [session]);

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

  return (
    <PageShell maxWidth="lg">
      <div className="flex items-center justify-between mb-12">
        <Logo />
        <Button variant="ghost" onClick={handleSignOut} className="text-sm text-muted-foreground">
          Kirjaudu ulos
        </Button>
      </div>

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Omat tilaukset
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Näet täältä käynnissä olevat kyselysi.
      </p>

      {fetching ? (
        <p className="text-sm text-muted-foreground">Ladataan…</p>
      ) : orders.length === 0 ? (
        <div className="p-6 bg-surface rounded-lg border border-border text-center">
          <p className="text-muted-foreground">Ei tilauksia vielä.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-surface rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">
                    {groupLabels[order.group_type as keyof typeof groupLabels] ?? order.group_type}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Tavoite: {order.target_n} vastaajaa
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Sulkeutuu {formatDate(order.closes_at)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Vastauksia: {order.responseCount} / {order.target_n}
              </p>

              <Button
                variant="outline"
                onClick={() => navigate(`/admin/order/${order.id}`)}
                className="w-full py-5 text-base rounded-lg"
              >
                Avaa tilanne
              </Button>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default AdminDashboard;
