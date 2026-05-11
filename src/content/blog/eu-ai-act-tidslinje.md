---
title: "EU AI Act: tidslinjen, kort fortalt"
description: "Hvad der allerede gælder, hvad der lander om få måneder, og hvad det reelt betyder for organisationer der overvejer eller allerede bruger AI. Status maj 2026."
date: 2026-05-12
updated: 2026-05-12
tags: ["EU AI Act", "Compliance", "GDPR", "Governance"]
readingTime: "5 min"
---

EU AI Act er ikke ét regelsæt der pludselig gælder — det er en **trinvis indfasning** over flere år, hvor forskellige forpligtelser kicker ind på forskellige datoer. Det er præcis denne forhindring der gør, at mange organisationer enten panikker over noget der ikke gælder dem endnu, eller overser noget der allerede gælder dem nu.

Her er den korte version af tidslinjen og hvad hver milepæl betyder i praksis. Denne post er **dateret eksplicit** fordi tolkningen og håndhævelsen udvikler sig — tjek `Sidst opdateret` øverst, og dobbelt-tjek den nyeste status fra Kommissionen eller jeres nationale myndighed inden I lægger beslutninger på det.

## Tidslinjen

| Dato | Hvad træder i kraft |
| ---- | ------------------- |
| **1. august 2024** | AI Act trådte i kraft (officiel publikation) |
| **2. februar 2025** | **Forbudte AI-praksisser** og **AI literacy**-krav til personale |
| **2. august 2025** | Regler for **General Purpose AI (GPAI)** — krav til foundation models |
| **2. august 2026** | Brede anvendelse — **høj-risiko AI-systemer** og governance-krav |
| **2. august 2027** | Fuldt anvendelig (sidste undtagelser fases ud) |

## Hvad det betyder pr. milepæl

### Allerede i kraft (siden februar 2025)

**Forbudte praksisser** dækker AI der "scorer" individer socialt, manipulerende eller udnyttende reklame, ubegrundet ansigtsgenkendelse i offentlige rum, biometric categorization baseret på politiske/religiøse karakteristika, og lignende. Hvis I bruger AI mod borgere/forbrugere, er det her tjekket først.

**AI literacy** er det punkt mange overser. Det er et krav om at jeres personale, der bruger eller udvikler AI-systemer i deres arbejde, har et passende kvalifikationsniveau. Det er ikke nødvendigvis "alle skal have et AI-kursus" — det er kontekstafhængigt — men I skal kunne **dokumentere** at de der træffer beslutninger med AI ved hvad systemet kan og ikke kan.

### Allerede i kraft (siden august 2025)

**GPAI-regler** gælder primært udbyderne (OpenAI, Anthropic, Google, Mistral m.fl.), men har afsmittende effekt: hvis I bruger en foundation model, kan I forvente at modtage mere struktureret information om model-kapabiliteter, træningsdata-typer og brugsbegrænsninger. Brug det aktivt i jeres egne risikovurderinger.

### Næste milepæl (2. august 2026)

Den store: **høj-risiko AI-systemer** kommer under fuldt regelsæt. Hvad er høj-risiko? Bilag III lister konkrete områder — bl.a. **kreditværdighed**, **rekruttering og HR**, **uddannelse og prøver**, **migration og asyl**, **kritisk infrastruktur**, **medicinsk diagnostik**, **retshåndhævelse**, og **administration af offentlige ydelser**.

For organisationer der bygger eller bruger AI i disse områder, betyder det:

- **Risk management system** — formaliseret proces for at identificere, evaluere og mitigere risici
- **Data governance** — datakvalitets-krav, bias-vurdering, dokumentation af trænings-/test-data
- **Teknisk dokumentation** — udførlig beskrivelse af systemet, dets formål, præcision og begrænsninger
- **Human oversight** — meaningful kontrol over systemets beslutninger, ikke bare en rubber-stamp
- **Logging og auditability** — kunne genskabe og forklare hvad systemet gjorde og hvorfor
- **Conformity assessment** — formel vurdering inden ibrugtagning, med CE-mærkning i visse tilfælde

### Endelig milepæl (2. august 2027)

De sidste undtagelser fases ud, primært for systemer der allerede var i drift før AI Act trådte i kraft.

## Hvad I konkret bør gøre nu (maj 2026)

1. **Kortlæg jeres AI-anvendelse** — hvilke systemer bruger eller udvikler I, og hvor falder de i risiko-taksonomien? Det er ikke trivielt: et chat-værktøj brugt til intern videnssøgning er typisk *low risk*, men det samme værktøj brugt til at vurdere ansøgere er *høj-risiko*
2. **Verificér AI literacy** — har I dokumenteret at de relevante medarbejdere har det rette kvalifikationsniveau? Hvis ikke, opbyg en simpel proces nu
3. **Stop forbudte praksisser** — hvis I har noget der falder under forbudslisten, skal det være lukket ned. Det er ikke fremtid; det er nutid
4. **Forbered governance til høj-risiko (hvis relevant)** — risk management, data governance, teknisk dokumentation, audit logs. 2026-deadlinen lyder fjern, men de processer tager længere at etablere end de fleste regner med
5. **Hold øje med nationale myndigheders præciseringer** — Kommissionens guidance og Datatilsynet/Konkurrence- og Forbrugerstyrelsens udmeldinger ændrer fortolkningen løbende

## Hvad det IKKE er

AI Act er **ikke** en "alt AI er nu reguleret hårdt"-lov. Langt det meste AI — interne assistenter, kode-completion, RAG-baseret videnssøgning, marketing-automation, søgning, anbefaling med lav indflydelse — er **low risk** og har minimale formelle krav.

Det er heller **ikke** en erstatning for GDPR. Hvis I behandler personoplysninger med AI, gælder GDPR fortsat fuldt ud. AI Act lægger sig oveni for de højest-risiko use cases.

## Hvis I står med en konkret vurdering

Det her er den ene gang hvor det er værd at få et udefra-blik. En gap-analyse skal:

1. Klassificere hvert AI-system i jeres organisation
2. Mappe det mod Bilag III og forbudslisten
3. Identificere konkrete manglende governance-elementer
4. Prioritere hvad der skal være på plads inden 2. august 2026

[Sig til hvis I står med den vurdering](/#kontakt) — jeg laver dem som korte, fokuserede forløb (typisk 1-2 uger), ikke åbne consulting-projekter.
