import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import DistributionBar from "@/components/DistributionBar";
import { surveyQuestions } from "@/lib/survey-data";

const mockResponses: number[][] = [
  [5, 6, 7, 6, 5, 7, 8, 6],
  [4, 5, 6, 5, 4, 6, 5, 7],
  [3, 4, 5, 4, 6, 5, 4, 3],
  [6, 7, 7, 8, 6, 7, 8, 7],
  [5, 5, 6, 4, 5, 6, 5, 7],
  [4, 3, 5, 4, 3, 4, 5, 6],
  [6, 7, 6, 5, 7, 6, 8, 7],
  [5, 6, 5, 4, 5, 6, 7, 5],
  [7, 7, 8, 6, 7, 8, 7, 6],
  [5, 6, 6, 5, 7, 6, 5, 6],
];

const AdminSnapshot = () => {
  const navigate = useNavigate();

  return (
    <PageShell maxWidth="lg">
      <Logo />

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Tilannekuva
      </h1>
      <p className="text-base text-muted-foreground mb-10 leading-relaxed">
        Tämä näkymä kertoo miten vastaukset jakautuvat.
        Se ei sisällä tulkintaa tai johtopäätöksiä.
      </p>

      <div className="space-y-8 mb-10">
        {surveyQuestions.map((question, i) => (
          <div key={i} className="p-5 bg-surface rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-4">
              {question}
            </p>
            <DistributionBar responses={mockResponses[i]} />
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Tämä on tilannetieto, ei analyysi.
      </p>

      <Button
        onClick={() => navigate("/admin/analysis")}
        className="w-full py-6 text-base rounded-lg"
      >
        Jatka analyysiin
      </Button>
    </PageShell>
  );
};

export default AdminSnapshot;
