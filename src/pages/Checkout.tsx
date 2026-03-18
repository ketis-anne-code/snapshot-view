import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const products = [
  {
    id: "snapshot-basic",
    name: "Snapshot — kirjallinen analyysi",
    price: "390 €",
    priceId: "price_1TCNtnAGo8WRIKeGfmIdblEI",
    features: ["Kirjallinen analyysiraportti", "Vastausten yhteenveto"],
  },
  {
    id: "snapshot-plus",
    name: "Snapshot — kirjallinen analyysi + läpikäynti",
    price: "590 €",
    priceId: "price_1TCNusAGo8WRIKeGuXiCG2Qr",
    features: [
      "Kirjallinen analyysiraportti",
      "Vastausten yhteenveto",
      "Henkilökohtainen läpikäynti",
    ],
  },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const state = location.state as { group?: string; target?: number } | null;

  const handleCheckout = async () => {
    const product = products.find((p) => p.id === selected);
    if (!product) return;

    setLoading(true);
    try {
      const origin = window.location.origin;

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: product.priceId,
          successUrl: `${origin}/admin/start`,
          cancelUrl: `${origin}/checkout`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Valitse tuote
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Valitse sinulle sopiva vaihtoehto ja siirry maksamaan.
      </p>

      <div className="space-y-4 mb-10">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelected(product.id)}
            className={cn(
              "w-full text-left px-5 py-5 rounded-lg border transition-colors duration-150",
              selected === product.id
                ? "border-primary bg-lilac-soft"
                : "border-border bg-surface hover:border-primary/30"
            )}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-medium text-foreground">
                {product.name}
              </span>
              <span className="text-lg font-semibold text-foreground ml-4">
                {product.price}
              </span>
            </div>
            <ul className="space-y-1">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <Button
        onClick={handleCheckout}
        disabled={!selected || loading}
        className="w-full py-6 text-base rounded-lg"
      >
        {loading ? "Ladataan..." : "Siirry maksamaan"}
      </Button>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
      >
        ← Takaisin
      </button>
    </PageShell>
  );
};

export default Checkout;
