export type RespondentGroup = "expert" | "manager" | "executive";

export const groupLabels: Record<RespondentGroup, string> = {
  expert: "Asiantuntijatiimi",
  manager: "Esihenkilötiimi",
  executive: "Johtoryhmä",
};

export interface SurveyQuestion {
  text: string;
  anchorLow: string;
  anchorHigh: string;
}

export const surveyQuestions: SurveyQuestion[] = [
  { text: "Minulle on selvää, mitä minun pitää kunakin päivänä saada tehtyä.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Yhteistyö muiden kanssa tukee omaa työni tekemistä.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Työmääräni tuntuu hallittavalta suurimman osan ajasta.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Uskallan tuoda esiin uusia ideoita ja kehitysehdotuksia.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Pystyn priorisoimaan työtehtäväni arjessa.", anchorLow: "En pysty", anchorHigh: "Pystyn erittäin hyvin" },
  { text: "Palaverit ja yhteiset kokoukset tukevat omaa työntekoa.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Koen hallitsevani omaa työtäni arjessa.", anchorLow: "En lainkaan", anchorHigh: "Erittäin hyvin" },
  { text: "Tiedän mistä löydän tarvitsemani tiedon työhöni liittyen.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Pystyn keskittymään työhöni silloin kun se on tarpeen.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Saan työssäni tukea silloin, kun sitä tarvitsen.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Työn suunnittelu ja organisointi tuntuu minulle helpolta.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Koen, että näkemyksilläni on merkitystä työssäni.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Saan työni kannalta olennaisen tiedon ajoissa.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Minulle on selvää, mitä minulta odotetaan työssäni.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
  { text: "Koen työni tällä hetkellä mielekkääksi.", anchorLow: "Täysin eri mieltä", anchorHigh: "Täysin samaa mieltä" },
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
