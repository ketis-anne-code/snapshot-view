import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Logo />

      <h1 className="text-3xl font-semibold text-foreground mb-4 leading-tight">
        Miten työ sujuu?
      </h1>
      <p className="text-base text-muted-foreground mb-12 leading-relaxed max-w-sm">
        Kerro kokemuksesi — vastauksesi pysyvät anonyymeinä.
      </p>

      <div className="space-y-3">
        <Button
          onClick={() => navigate("/onboarding")}
          className="w-full py-6 text-base rounded-lg"
        >
          Luo kysely
        </Button>
        <Button
          onClick={() => navigate("/survey/intro")}
          variant="outline"
          className="w-full py-6 text-base rounded-lg"
        >
          Olen vastaaja
        </Button>
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Demonäkymät
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { label: "Hallinta", path: "/admin/start" },
            { label: "Kysely käynnissä", path: "/admin/running" },
            { label: "Tilannekuva", path: "/admin/snapshot" },
            { label: "Analyysi", path: "/admin/analysis" },
            { label: "Valmis", path: "/admin/final" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-xs text-primary hover:text-lilac-hover px-3 py-1.5 border border-border rounded-md"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default Index;
