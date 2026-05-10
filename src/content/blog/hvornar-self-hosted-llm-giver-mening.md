---
title: "Hvornår giver self-hosted LLM faktisk mening?"
description: "De fleste virksomheder skal ikke hoste deres egen LLM. Men nogle skal — og det er værd at vide hvilke kriterier der reelt afgør det."
date: 2026-04-18
tags: ["LLM", "Infrastruktur", "Self-hosted"]
readingTime: "6 min"
---

Hver uge har jeg den samme samtale med en ny CTO eller IT-direktør: *"Skal vi hoste vores egen LLM?"* Og næsten altid begynder argumentet samme sted — *data sikkerhed* og *uafhængighed fra Big Tech*. Begge er valide bekymringer. Men de er sjældent det rigtige sted at starte beslutningen.

## De fire kriterier der faktisk afgør det

Når man skærer al hype væk, er der reelt fire dimensioner der bestemmer om self-hosting giver mening:

### 1. Volumen og forudsigelighed

LLM-API'er er ekstremt fleksible men har en pris pr. token. Self-hosting har høje faste omkostninger (GPU-hardware eller reserved capacity) men lave marginale omkostninger.

Break-even er svær at angive med ét tal — flere variabler skal med samtidig:

- **Modelpris pr. token** — Sonnet 4.6 til ~$3 input / $15 output, GPT-mini-modeller billigere
- **Output-ratio** — output-tokens er typisk 5-6× dyrere end input. Workloads med høj output-andel (kode-generation, lange svar) tipper hurtigere mod self-hosting
- **GPU-utilization** — en H100 der står stille 70 % af tiden er meget dyrere pr. produktiv token end API'er. Self-hosting kræver høj og forudsigelig last
- **Caching** — leverandørernes prompt-caching kan halvere reel pris ved gentagne system prompts
- **MLOps-overhead** — drift, monitoring, model-evals, opdatering, backup. Det er ikke gratis

For mange workloads ligger break-even ved meget høj og stabil last. Den eneste pålidelige måde at vurdere det på er at lave business casen med jeres faktiske API-forbrug og realistisk lokal-utilization.

### 2. Reelle data-restriktioner

Bemærk ordet *reelle*. Mange organisationer bruger data-bekymringer som proxy for "vi har ikke styr på hvad vores politik faktisk siger". De fleste kommercielle LLM-leverandører tilbyder i dag enterprise-aftaler hvor data ikke bruges til træning, opbevares i EU, og kan slettes efter SLA.

Self-hosting bliver det rigtige valg når:
- I er underlagt regulatorisk krav om at data fysisk forbliver i jeres infrastruktur (visse finans- og sundhedsdomæner)
- I behandler data så følsom at end ikke en zero-retention enterprise-aftale er acceptabel for jeres compliance
- I har eksisterende kontrakter med kunder der eksplicit forbyder tredjeparts AI-behandling

### 3. Modelmodifikation

Skal I fine-tune på jeres egne data? Skal I køre meget specifikke open-weights modeller (f.eks. til dansk eller et fagdomæne)? Det taler for self-hosting. Hvis I bare bruger en frontier model out-of-the-box, taler det imod.

### 4. Strategisk risiko og leverandør-afhængighed

Det her er det kriterium folk oftest glemmer — og det er nok det vigtigste at have med i regnestykket på 3-5 års sigt.

De nuværende API-priser fra Anthropic, OpenAI og lignende **er sandsynligvis ikke prissat efter reelle inference-omkostninger**. Vi befinder os i en markedsplads hvor leverandørerne kæmper om markedsandele med subsidierede priser, og hvor de samtidig brænder enorme summer af på model-træning og GPU-opbygning. Indtjeningen pr. token dækker næppe de fulde omkostninger på frontier-modellerne i dag — det er VC-finansieret kapløb om at definere et fremtidigt marked.

Det betyder at en business case der bygger på "API-priserne i dag" er en business case bygget på en *midlertidig* tilstand. Konkret risiko:

- **Prisen kan stige skarpt** når markedet konsoliderer og leverandørerne har brug for at tjene penge — eller når kapital-tilgangen strammes til. En 3-5× prisstigning over 18 måneder er ikke et urealistisk scenarie
- **Modeller kan blive deprecated** med kort varsel. I kan vågne op til at den model jeres pipeline er bygget på ikke længere er tilgængelig — eller kun som "legacy" til højere pris
- **Kapacitet kan blive prioriteret** til større kunder. Rate limits på små konti er allerede en realitet og bliver sandsynligvis strammere
- **Geopolitisk og regulatorisk risiko** — leverandører i USA opererer under amerikansk ret. Eksportkontrol, sanktioner, eller pludselig regulering kan ændre tilgængelighed på dage. EU AI Act-håndhævelsen er stadig i støbeskeen og kan tvinge ændringer i hvem der kan tilbyde hvad
- **Vendor lock-in i selve outputtet** — prompts og fine-tunes der virker præcis sådan på Sonnet 4.6 virker ikke nødvendigvis ens på den næste model, hverken hos samme eller en anden leverandør

Self-hosting på open-weights-modeller fungerer i denne sammenhæng som **forsikring**: I kontrollerer jeres egen kapacitet, jeres egen costbasis, jeres egen tidshorisont. Det er ikke nødvendigvis billigere i dag, men det er **forudsigeligt** og **ikke afhængigt af en tredjeparts forretningsmodel**.

For nogle organisationer er denne forsikring ikke det værd — risikoprofilen er lav nok og fleksibiliteten ved API'er for værdifuld. For andre — kritisk infrastruktur, langsigtede produktinvesteringer, regulerede industrier, leverandører til offentlig sektor — er det her selve grunden til at gå self-hosted, uanset hvad regnskabet siger lige nu.

## Hvad folk undervurderer

Tre ting jeg konsekvent ser undervurderet i self-hosting business cases:

1. **Kontinuerlig modelopdatering.** Frontier modeller forbedres hver 3.-6. måned. Open-weights gør det også, men I skal have en proces til at evaluere og rul-ud — ellers stagnerer jeres løsning.

2. **GPU-utilization.** Det lyder smart at have egen H100 — indtil man indser at den står stille 70% af tiden. API'erne deler kapacitet på tværs af tusindvis af kunder.

3. **MLOps-modenhed.** Hvis I ikke allerede har monitoring, deployment automation, og evaluerings-pipelines for traditionel ML — så bygger I det fra scratch nu, oveni LLM-driften.

## Mit konkrete råd

Start med API'er for de fleste use cases. Mål forbruget i mindst 3 måneder. Hvis I rammer kriterier 1-3 — volumen, dokumenterede regulatoriske krav, eller behov for modelmodifikation — så er business casen for self-hosting konkret og kan beregnes.

Kriterium 4 er anderledes: det er ikke en business case, det er en **strategisk vurdering**. Står I med en langsigtet produkt-investering eller kritisk infrastruktur hvor I ikke kan tåle 5× prisstigning eller pludselig model-deprecation om 18 måneder? Så er self-hosted kapacitet en del af risikostyringen — uanset hvad det aktuelle regnestykke siger.

Det jeg ser galt for ofte er to ting: enten *start self-hosted uden at måle* (koster typisk 1-2 millioner og 6-12 måneder før erkendelsen), eller *byg en kritisk forretningsfunktion 100 % på en enkelt cloud-leverandørs nuværende pris og produkttilbud uden plan B* (koster meget mere når regningen kommer).

Har I en konkret beslutning forude? [Jeg hjælper gerne med vurderingen](/#kontakt).
