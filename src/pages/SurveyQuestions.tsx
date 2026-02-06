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
          Optional
        </div>

        <h1 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
          Is there anything else you'd like to add?
        </h1>

        <Textarea
          value={openText}
          onChange={(e) => setOpenText(e.target.value)}
          placeholder="Write freely — this is optional."
          className="min-h-[120px] bg-surface mb-8"
        />

        <Button
          onClick={handleSubmit}
          className="w-full py-6 text-base rounded-lg"
        >
          Submit survey
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Logo />

      {/* Progress */}
      <div className="mb-8 text-sm text-muted-foreground">
        {currentIndex + 1} / {surveyQuestions.length}
      </div>

      {/* Question */}
      <h1 className="text-xl font-semibold text-foreground mb-10 leading-relaxed">
        {surveyQuestions[currentIndex]}
      </h1>

      {/* Scale */}
      <div className="mb-10">
        <ScaleInput value={currentAnswer} onChange={handleSelect} />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex-1 py-6 text-base rounded-lg"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentAnswer === null}
          className="flex-1 py-6 text-base rounded-lg"
        >
          {isLastQuestion ? "Continue" : "Next"}
        </Button>
      </div>
    </PageShell>
  );
};

export default SurveyQuestions;
