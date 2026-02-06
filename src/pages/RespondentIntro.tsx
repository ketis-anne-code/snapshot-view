import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const RespondentIntro = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Logo />

      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Before you begin
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-4">
          The purpose of this survey is to get a general view of what currently works in everyday work and what doesn't.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Responses are handled as a combined overview and cannot be linked to individuals.
        </p>
      </div>

      <Button
        onClick={() => navigate("/survey/questions")}
        className="w-full py-6 text-base rounded-lg"
      >
        Start survey
      </Button>
    </PageShell>
  );
};

export default RespondentIntro;
