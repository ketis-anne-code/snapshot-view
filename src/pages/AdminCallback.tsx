import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export default function AdminCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "failed">("working");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // 1) Tämä hoitaa sen puuttuvan askeleen: code -> session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (cancelled) return;

        if (error) {
          setStatus("failed");
          return;
        }

        // 2) Varmistetaan vielä session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/admin", { replace: true });
        } else {
          setStatus("failed");
        }
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <PageShell>
      <Logo />
      {status === "failed" ? (
        <div className="text-center">
          <p className="text-base text-foreground mb-4">Kirjautuminen ei onnistunut.</p>
          <p className="text-sm text-muted-foreground">
            Palaa ja pyydä uusi linkki:{" "}
            <a href="/admin/sign-in" className="text-primary underline">
              Kirjaudu uudelleen
            </a>
          </p>
        </div>
      ) : (
        <p className="text-base text-muted-foreground text-center">Kirjaudutaan sisään…</p>
      )}
    </PageShell>
  );
}
