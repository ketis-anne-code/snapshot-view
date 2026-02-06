import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";

const SurveyComplete = () => {
  return (
    <PageShell>
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-4">
        Thank you
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed">
        Your response has been recorded. You can close this page.
      </p>
    </PageShell>
  );
};

export default SurveyComplete;
