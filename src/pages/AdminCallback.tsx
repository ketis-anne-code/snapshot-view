import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

const AdminCallback = () => {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !cancelled) {
        navigate("/admin", { replace: true });
        return;
      }
    };

    // Try immediately
    check();

    // Poll every second for up to 8 seconds
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !cancelled) {
        clearInterval(interval);
        navigate("/admin", { replace: true });
      } else if (attempts >= 8) {
        clearInterval(interval);
        if (!cancelled) setFailed(true);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <PageShell>
      <Logo />
      {failed ? (
        <div className="text-center">
          <p className="text-base text-foreground mb-4">
            Kirjautuminen ei onnistunut.
          </p>
          <p className="text-sm text-muted-foreground">
            Palaa ja pyydä uusi linkki:{" "}
            <a href="/admin/sign-in" className="text-primary underline">
              Kirjaudu uudelleen
            </a>
          </p>
        </div>
      ) : (
        <p className="text-base text-muted-foreground text-center">
          Kirjaudutaan sisään…
        </p>
      )}
    </PageShell>
  );
};

export default AdminCallback;
