export type RespondentGroup = "expert" | "manager" | "executive";

export const groupLabels: Record<RespondentGroup, string> = {
  expert: "Asiantuntijatiimi",
  manager: "Esihenkilötiimi",
  executive: "Johtoryhmä",
};

export const surveyQuestions = [
  "Päivittäiset tehtävät ovat selkeitä ja hyvin järjestettyjä.",
  "Tarvittava tieto on saatavilla silloin kun sitä tarvitaan.",
  "Päätökset syntyvät ilman turhia viiveitä.",
  "Yhteistyö tiimin sisällä sujuu hyvin.",
  "Prioriteetit ovat helppo ymmärtää ja seurata.",
  "Nykyiset työkalut ja prosessit tukevat työtä hyvin.",
  "Työmäärä tuntuu hallittavalta tavallisella viikolla.",
  "Uusia ideoita ja parannusehdotuksia on helppo tuoda esiin.",
  "Viestintä tiimin sisällä on selkeää ja oikea-aikaista.",
  "Tiimillä on edellytykset tehdä hyvää työtä.",
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
      return "Riittävä vastausmäärä";
    case "indicative":
      return "Suuntaa antava vastausmäärä";
    case "limited":
      return "Rajallinen vastausmäärä";
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
