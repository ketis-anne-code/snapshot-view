
# AdminSnapshot: kytkenta Supabaseen RPC-kutsulla

## Yhteenveto

Korvataan AdminSnapshot.tsx:n mock-data oikealla `get_admin_survey_status_v2` RPC-kutsulla. Jakaumia (distribution) ei lisata viela. Sivu nayttaa tilannekortin: vastauksia/tavoite, aineiston tila (data_state) ja sulkeutumispaiva.

## Muutokset

### 1. App.tsx - reitti

Rivi 41: vaihdetaan `/admin/snapshot` -> `/admin/snapshot/:surveyId`

### 2. AdminSnapshot.tsx - uudelleenkirjoitus

Poistetaan kokonaan mock-data, DistributionBar-importti ja surveyQuestions-importti.

Uusi rakenne:
- Luetaan `surveyId` kayttaen `useParams`
- Suojataan reitti `useAuth`-hookilla (redirect `/admin/sign-in` jos ei sessiota)
- Maaritellaan paikallinen tyyppi `AdminSurveyStatus` (survey_id, order_id, group_type, target_n, opens_at, closes_at, responses_count, data_state)
- Kutsutaan `supabase.rpc("get_admin_survey_status_v2", { p_survey_id: surveyId })` ja castataan tulos paikalliseen tyyppiin
- Naytetaan tilannekortit:
  - **Vastauksia**: `{responses_count} / {target_n}`
  - **Aineiston tila**: vari-indikaattori data_state-arvon mukaan (red/yellow/green) kayttaen olemassa olevaa StatusDot-komponenttia (mapaten red->limited, yellow->indicative, green->sufficient)
  - **Kysely sulkeutuu**: `closes_at` muotoiltuna `dd.mm.yyyy`
- Virhetilanteessa: "Ei oikeuksia tai kyselya ei loytynyt."
- Latauksen aikana: "Ladataan..."
- "Takaisin"-nappi -> `navigate(-1)`
- "Kirjaudu ulos"-nappi

### 3. AdminOrderDetail.tsx - uusi nappi

Lisataan "Nayta tulokset" -napin ylapuolelle tai viereen toinen nappi:

```
"Tilannekuva" -> navigate(`/admin/snapshot/${survey.id}`)
```

### 4. Ei muutoksia tietokantaan

`get_admin_survey_status_v2` on jo olemassa Supabasessa. Koska se ei ole types.ts:ssa, kaytamme `.rpc()` kutsua `as any` castilla ja paikallista tyyppia.

## Tiedostot jotka muuttuvat

| Tiedosto | Muutos |
|---|---|
| `src/App.tsx` | Rivi 41: reitti `/admin/snapshot/:surveyId` |
| `src/pages/AdminSnapshot.tsx` | Kokonaan uudelleenkirjoitus |
| `src/pages/AdminOrderDetail.tsx` | Lisataan "Tilannekuva"-nappi |
