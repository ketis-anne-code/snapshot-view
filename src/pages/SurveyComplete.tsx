import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";

const SurveyComplete = () => {
  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-4">
        Kiitos
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed">
        Vastauksesi on tallennettu. Voit sulkea tämän sivun.
      </p>
    </PageShell>
  );
};

export default SurveyComplete;
