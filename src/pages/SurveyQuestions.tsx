import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ScaleInput from "@/components/ScaleInput";
import { surveyQuestions } from "@/lib/survey-data";

const SurveyQuestions = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    surveyQuestions.map(() => null)
  );
  const [openText, setOpenText] = useState("");
  const [showOpenText, setShowOpenText] = useState(false);

  const isLastQuestion = currentIndex === surveyQuestions.length - 1;
  const currentAnswer = answers[currentIndex];

  const handleSelect = (value: number) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowOpenText(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSubmit = () => {
    navigate("/survey/complete");
  };

  if (showOpenText) {
    return (
      <PageShell>
        <Logo />

        <div className="mb-3 text-sm text-muted-foreground">
          Vapaaehtoinen
        </div>

        <h1 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
          Haluatko lisätä jotain?
        </h1>

        <Textarea
          value={openText}
          onChange={(e) => setOpenText(e.target.value)}
          placeholder="Kirjoita vapaasti — tämä on vapaaehtoinen."
          className="min-h-[120px] bg-surface mb-8"
        />

        <Button
          onClick={handleSubmit}
          className="w-full py-6 text-base rounded-lg"
        >
          Lähetä vastaukset
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Logo />

      <div className="mb-8 text-sm text-muted-foreground">
        {currentIndex + 1} / {surveyQuestions.length}
      </div>

      <h1 className="text-xl font-semibold text-foreground mb-10 leading-relaxed">
        {surveyQuestions[currentIndex].text}
      </h1>

      <div className="mb-10">
        <ScaleInput
          value={currentAnswer}
          onChange={handleSelect}
          anchorLow={surveyQuestions[currentIndex].anchorLow}
          anchorHigh={surveyQuestions[currentIndex].anchorHigh}
        />
      </div>

      <div className="flex gap-3">
        {currentIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex-1 py-6 text-base rounded-lg"
          >
            Takaisin
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentAnswer === null}
          className="flex-1 py-6 text-base rounded-lg"
        >
          {isLastQuestion ? "Jatka" : "Seuraava"}
        </Button>
      </div>
    </PageShell>
  );
};

export default SurveyQuestions;
