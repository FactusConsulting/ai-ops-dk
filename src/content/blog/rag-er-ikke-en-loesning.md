---
title: "RAG er ikke en løsning — det er et arkitekturmønster"
description: "Når kunden siger 'vi vil have RAG', er der ofte en anden samtale der bør finde sted først. Her er den jeg har."
date: 2026-03-04
tags: ["RAG", "Arkitektur", "AI-strategi"]
readingTime: "4 min"
---

"Vi vil gerne have RAG på vores dokumenter." Den sætning hører jeg ugentligt. Og næsten lige så ofte er svaret: *måske* — men lad os tale om hvad I faktisk prøver at opnå først.

## Hvad RAG er (og ikke er)

RAG — Retrieval Augmented Generation — er et arkitekturmønster hvor man kombinerer søgning med en LLM. Modellens svar baseres på dokumenter den har slået op, ikke kun på sin træningsdata.

Det er *ikke* en løsning. Det er en byggeklods. Lige som "database" eller "REST-API" ikke er en løsning.

## De tre spørgsmål jeg altid stiller

### 1. Hvad er det egentlige brugerproblem?

"Folk kan ikke finde info i SharePoint" og "vores rådgivere har brug for at sammenligne 5 produktnotater hurtigt" lyder ens — men er det ikke. Det første kan ofte løses bedre med god søgning og informationsarkitektur. Det andet er en typisk RAG use case.

### 2. Hvad sker der hvis svaret er forkert?

RAG hallucinerer mindre end ren generering, men hallucinerer stadig. Hvis et forkert svar koster noget reelt — penge, sikkerhed, regulatorisk risiko — så skal jeres RAG-arkitektur designes med kildehenvisninger, konfidens-scoring og menneskelig review-loop. Det er en helt anden løsning end "smart chatbot".

### 3. Hvilken kvalitet kræves?

Dette er undervurderet. En RAG-løsning der rammer rigtigt 70 % af tiden kan være guld for én use case og fuldstændig ubrugelig for en anden. Definér kvalitetstærsklen *før* I bygger — og byg en evalueringsmetode I kan måle på løbende.

## Hvor RAG er en god løsning

- Stor mængde dokumenter ingen kan overskue manuelt
- **Parsebart, chunkbart og citerbart indhold** — wiki, HTML, markdown, strukturerede Word-dokumenter, gode tekst-PDF'er. (Scannede PDF'er, layout-tunge bilag og tabeller kræver ekstra dokumentbehandling — RAG-pipeline'en bliver så stærk som dens indgangsled)
- Use case hvor brugeren kan validere svaret hurtigt (rådgivere, supportere, jurister)
- Krav om at svar skal kunne spores tilbage til kilde

## Hvor det ofte ikke er

- Når det reelle problem er manglende struktur i indholdet selv
- Når svaret skal være 100 % korrekt uden menneske i loopet (juridisk binding, finansielle beregninger)
- Når dokumenterne er meget korte og få **og** der ikke er behov for ACL, kildereferencer, versionsstyring eller audit — så er det ofte bare prompt-engineering
- Når brugerne ikke kan vurdere kvaliteten af svaret

## Bottom line

Spørg ikke jeres leverandør "kan I bygge RAG til os". Spørg "hvilket problem prøver vi at løse, og er RAG den bedste løsning på det?". Det er en helt anden samtale — og den fører oftere til løsninger der faktisk virker.
