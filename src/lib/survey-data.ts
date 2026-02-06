export type RespondentGroup = "expert" | "manager" | "executive";

export const groupLabels: Record<RespondentGroup, string> = {
  expert: "Expert team",
  manager: "Manager team",
  executive: "Executive team",
};

export const surveyQuestions = [
  "Everyday tasks are clear and well-organized.",
  "The right information is available when needed.",
  "Decisions get made without unnecessary delays.",
  "Collaboration across the team works smoothly.",
  "Priorities are easy to understand and follow.",
  "Current tools and processes support the work well.",
  "Workload feels manageable on a typical week.",
  "New ideas or improvements are easy to bring up.",
  "Communication within the team is clear and timely.",
  "The team has what it needs to do good work.",
];

export function getResponseStatus(
  collected: number,
  target: number
): "sufficient" | "indicative" | "limited" {
  const ratio = collected / target;
  if (ratio >= 0.7) return "sufficient";
  if (ratio >= 0.4) return "indicative";
  return "limited";
}

export function getStatusLabel(status: "sufficient" | "indicative" | "limited"): string {
  switch (status) {
    case "sufficient":
      return "Sufficient responses";
    case "indicative":
      return "Indicative responses";
    case "limited":
      return "Limited responses";
  }
}

export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}
