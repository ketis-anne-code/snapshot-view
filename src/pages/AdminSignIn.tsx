import { useState } from "react";
import { Navigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminSignIn = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Syötä kelvollinen sähköpostiosoite.");
      return;
    }

    setSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/callback`,
      },
    });

    setSubmitting(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setSent(true);
  };

  return (
    <PageShell>
      <Logo />

      <div className="p-8 bg-surface rounded-lg border border-border">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Kirjaudu hallintanäkymään
        </h1>

        {sent ? (
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            Linkki lähetetty. Tarkista sähköposti.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="anna@esimerkki.fi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full py-6 text-base rounded-lg"
              disabled={submitting}
            >
              {submitting ? "Lähetetään…" : "Lähetä kirjautumislinkki"}
            </Button>
          </form>
        )}
      </div>
    </PageShell>
  );
};

export default AdminSignIn;
