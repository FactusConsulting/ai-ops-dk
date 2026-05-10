---
title: "Hvornår giver self-hosted LLM faktisk mening?"
description: "De fleste virksomheder skal ikke hoste deres egen LLM. Men nogle skal — og det er værd at vide hvilke kriterier der reelt afgør det."
date: 2026-04-18
tags: ["LLM", "Infrastruktur", "Self-hosted"]
readingTime: "6 min"
---

Hver uge har jeg den samme samtale med en ny CTO eller IT-direktør: *"Skal vi hoste vores egen LLM?"* Og næsten altid begynder argumentet samme sted — *data sikkerhed* og *uafhængighed fra Big Tech*. Begge er valide bekymringer. Men de er sjældent det rigtige sted at starte beslutningen.

## De tre kriterier der faktisk afgør det

Når man skærer al hype væk, er der reelt tre dimensioner der bestemmer om self-hosting giver mening:

### 1. Volumen og forudsigelighed

LLM-API'er er ekstremt fleksible men har en pris pr. token. Self-hosting har høje faste omkostninger (GPU-hardware eller reserved capacity) men lave marginale omkostninger.

Break-even er svær at angive med ét tal. I 2026 er API-priserne på Sonnet- og GPT-mini-niveau modeller blevet markant lavere end for et par år siden, og en business case for self-hosting skal regne på flere variabler samtidig:

- **Modelpris pr. token** — Sonnet 4.6 til ~$3 input / $15 output, GPT-mini-modeller endnu billigere
- **Output-ratio** — output-tokens er typisk 5-6× dyrere end input. Workloads med høj output-andel (kode-generation, lange svar) tipper hurtigere mod self-hosting
- **GPU-utilization** — en H100 der står stille 70 % af tiden er meget dyrere pr. produktiv token end API'er. Self-hosting kræver høj og forudsigelig last
- **Caching** — leverandørernes prompt-caching kan halvere reel pris ved gentagne system prompts
- **MLOps-overhead** — drift, monitoring, model-evals, opdatering, backup. Det er ikke gratis

Praktisk: for mange workloads ligger break-even snarere ved **hundreder af millioner eller milliarder tokens/måned** end de få millioner — medmindre I allerede har hardwaren, kører meget billigere/mindre lokale modeller, eller compliance gør cloud umulig. Den eneste pålidelige måde at vurdere det på er at lave business casen med jeres faktiske API-forbrug og lokal-utilization.

### 2. Reelle data-restriktioner

Bemærk ordet *reelle*. Mange organisationer bruger data-bekymringer som proxy for "vi har ikke styr på hvad vores politik faktisk siger". De fleste kommercielle LLM-leverandører tilbyder i dag enterprise-aftaler hvor data ikke bruges til træning, opbevares i EU, og kan slettes efter SLA.

Self-hosting bliver det rigtige valg når:
- I er underlagt regulatorisk krav om at data fysisk forbliver i jeres infrastruktur (visse finans- og sundhedsdomæner)
- I behandler data så følsom at end ikke en zero-retention enterprise-aftale er acceptabel for jeres compliance
- I har eksisterende kontrakter med kunder der eksplicit forbyder tredjeparts AI-behandling

### 3. Modelmodifikation

Skal I fine-tune på jeres egne data? Skal I køre meget specifikke open-weights modeller (f.eks. til dansk eller et fagdomæne)? Det taler for self-hosting. Hvis I bare bruger en frontier model out-of-the-box, taler det imod.

## Hvad folk undervurderer

Tre ting jeg konsekvent ser undervurderet i self-hosting business cases:

1. **Kontinuerlig modelopdatering.** Frontier modeller forbedres hver 3.-6. måned. Open-weights gør det også, men I skal have en proces til at evaluere og rul-ud — ellers stagnerer jeres løsning.

2. **GPU-utilization.** Det lyder smart at have egen H100 — indtil man indser at den står stille 70% af tiden. API'erne deler kapacitet på tværs af tusindvis af kunder.

3. **MLOps-modenhed.** Hvis I ikke allerede har monitoring, deployment automation, og evaluerings-pipelines for traditionel ML — så bygger I det fra scratch nu, oveni LLM-driften.

## Mit konkrete råd

Start med API'er. Mål forbruget i mindst 3 måneder. Hvis I så rammer ovenstående kriterier — primært volumen og dokumenterede regulatoriske krav — så har I et reelt fundament for at lave business casen for self-hosting.

Det modsatte (start self-hosted, byg op, find ud af det ikke kunne betale sig) ser jeg desværre alt for ofte. Det koster typisk 1-2 millioner og 6-12 måneder.

Har I en konkret beslutning forude? [Jeg hjælper gerne med vurderingen](/#kontakt).
