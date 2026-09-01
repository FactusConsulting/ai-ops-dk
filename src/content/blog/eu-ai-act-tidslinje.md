---
title: "EU AI Act: tidslinjen, kort fortalt"
description: "Hvad der allerede gælder, hvad der blev udskudt med Digital Omnibus i juli 2026, og hvad det reelt betyder for organisationer der overvejer eller allerede bruger AI. Status september 2026."
date: 2026-05-12
updated: 2026-09-01
tags: ["EU AI Act", "Compliance", "GDPR", "Governance"]
readingTime: "6 min"
---

EU AI Act er ikke ét regelsæt der pludselig gælder — det er en **trinvis indfasning** over flere år, hvor forskellige forpligtelser kicker ind på forskellige datoer. Det er præcis den forhindring der gør, at mange organisationer enten panikker over noget der ikke gælder dem endnu, eller overser noget der allerede gælder dem nu.

Her er den korte version af tidslinjen og hvad hver milepæl betyder i praksis. Denne post er **dateret eksplicit** fordi tolkningen og håndhævelsen udvikler sig — tjek `Sidst opdateret` øverst, og dobbelt-tjek den nyeste status fra Kommissionen eller jeres nationale myndighed inden I lægger beslutninger på det.

## Det vigtigste siden sidst: august-deadlinen flyttede sig

Da jeg skrev denne post i maj, var **2. august 2026** den store forestående milepæl: dagen hvor høj-risiko-systemerne kom under fuldt regelsæt. Den dato holdt ikke.

**Regulation (EU) 2026/1744 — "Digital Omnibus on AI"** blev offentliggjort i EU-Tidende 24. juli 2026 og trådte i kraft 27. juli, seks dage før den oprindelige deadline. Den udskyder de tunge høj-risiko-forpligtelser med godt halvandet år.

Det er værd at være præcis om hvad der flyttede sig, for det var **ikke** det hele:

| Forpligtelse | Var | Er nu |
| ------------ | --- | ----- |
| Høj-risiko, Bilag III (selvstændige systemer) | 2. aug 2026 | **2. dec 2027** |
| Høj-risiko, Bilag I (indlejret i regulerede produkter) | 2. aug 2027 | **2. aug 2028** |
| Nationale AI-sandkasser | 2. aug 2026 | **2. aug 2027** |
| Artikel 50 — transparens | 2. aug 2026 | **uændret** |
| Artikel 4 — AI literacy | i kraft siden feb 2025 | **uændret** |
| Artikel 5 — forbudte praksisser | i kraft siden feb 2025 | **uændret** |
| GPAI (art. 51–56) | i kraft siden aug 2025 | **uændret** |

Begrundelsen fra lovgiverne er praktisk snarere end principiel: de harmoniserede standarder og compliance-værktøjer, som høj-risiko-kravene forudsætter, var ikke færdige, og flere medlemsstater havde ikke engang udpeget deres kompetente myndigheder.

## Tidslinjen som den ser ud nu

| Dato | Hvad træder i kraft |
| ---- | ------------------- |
| **1. august 2024** | AI Act trådte i kraft (officiel publikation) |
| **2. februar 2025** | **Forbudte AI-praksisser** og **AI literacy**-krav til personale |
| **2. august 2025** | Regler for **General Purpose AI (GPAI)** — krav til foundation models |
| **2. august 2026** | **Artikel 50-transparens** — oplysningspligt og mærkning af AI-genereret indhold |
| **2. december 2026** | Frist for maskinlæsbar mærkning (art. 50, stk. 2) for systemer der allerede var på markedet |
| **2. august 2027** | Nationale AI-sandkasser skal være etableret |
| **2. december 2027** | **Høj-risiko-systemer, Bilag III** — det fulde governance-regelsæt |
| **2. august 2028** | **Høj-risiko indlejret i regulerede produkter, Bilag I** |

## Hvad det betyder pr. milepæl

### Allerede i kraft (siden februar 2025)

**Forbudte praksisser** dækker AI der "scorer" individer socialt, manipulerende eller udnyttende reklame, ubegrundet ansigtsgenkendelse i offentlige rum, biometrisk kategorisering baseret på politiske/religiøse karakteristika, og lignende. Hvis I bruger AI mod borgere/forbrugere, er det her tjekket først. Omnibus-pakken **tilføjede** to kategorier til forbudslisten — ikke-samtykkende intime billeder og materiale med seksuelt misbrug af børn — med en indfasning frem til 2. december 2026.

**AI literacy** er det punkt mange overser. Det er et krav om at jeres personale, der bruger eller udvikler AI-systemer i deres arbejde, har et passende kvalifikationsniveau. Det er ikke nødvendigvis "alle skal have et AI-kursus" — det er kontekstafhængigt — men I skal kunne **dokumentere** at de der træffer beslutninger med AI ved hvad systemet kan og ikke kan.

### Allerede i kraft (siden august 2025)

**GPAI-regler** gælder primært udbyderne (OpenAI, Anthropic, Google, Mistral m.fl.), men har afsmittende effekt: hvis I bruger en foundation model, kan I forvente at modtage mere struktureret information om model-kapabiliteter, træningsdata-typer og brugsbegrænsninger. Brug det aktivt i jeres egne risikovurderinger.

### Nyt siden august 2026: transparens

**Artikel 50** overlevede omnibus-pakken uændret og gælder nu. Den er langt bredere relevant end høj-risiko-reglerne, fordi den rammer helt almindelig brug:

- Interagerer en bruger med et AI-system — en chatbot, en telefonassistent — skal det **oplyses**, medmindre det er åbenlyst
- AI-genereret eller -manipuleret indhold skal **mærkes maskinlæsbart**
- Deepfakes og AI-genereret tekst udgivet i offentlighedens interesse skal mærkes som sådan

For systemer der allerede var på markedet 2. august 2026, er der frist til **2. december 2026** for den maskinlæsbare mærkning. Hvis I har en kundevendt chatbot eller genererer indhold med AI, er det her jeres nærmeste reelle deadline — ikke 2027.

### Næste tunge milepæl (2. december 2027)

**Høj-risiko AI-systemer** kommer under fuldt regelsæt. Hvad er høj-risiko? Bilag III lister konkrete områder — bl.a. **kreditværdighed**, **rekruttering og HR**, **uddannelse og prøver**, **migration og asyl**, **kritisk infrastruktur**, **medicinsk diagnostik**, **retshåndhævelse**, og **administration af offentlige ydelser**.

For organisationer der bygger eller bruger AI i disse områder, betyder det:

- **Risk management system** — formaliseret proces for at identificere, evaluere og mitigere risici
- **Data governance** — datakvalitets-krav, bias-vurdering, dokumentation af trænings-/test-data
- **Teknisk dokumentation** — udførlig beskrivelse af systemet, dets formål, præcision og begrænsninger
- **Human oversight** — meaningful kontrol over systemets beslutninger, ikke bare en rubber-stamp
- **Logging og auditability** — kunne genskabe og forklare hvad systemet gjorde og hvorfor
- **Conformity assessment** — formel vurdering inden ibrugtagning, med CE-mærkning i visse tilfælde

## Udskudt er ikke aflyst

Det er den vigtigste pointe i hele denne opdatering, og den er nem at læse forkert.

Omnibus-pakken flyttede **fristen for at efterleve** kravene. Den ændrede ikke **hvilke systemer der er høj-risiko**, og den fjernede ikke klassificeringen i artikel 6. Et rekrutteringsværktøj der var høj-risiko i maj, er det stadig — I har bare længere tid til at få governance på plads.

I praksis betyder det, at arbejdet ikke bør sættes på pause:

- **Klassificeringen kan laves nu** og er uafhængig af deadlinen. I kan ikke planlægge efter en frist før I ved hvilke af jeres systemer der rammes af den
- **De processer der kræves — risk management, data governance, audit logs — tager længere at etablere end de fleste regner med.** Halvandet år ekstra lyder rigeligt lige nu; det gjorde de oprindelige to år også
- **Artikel 50 gælder i dag.** Hvis udskydelsen får jer til at lukke AI Act-mappen helt, overser I den forpligtelse der faktisk er aktiv

Jeg har set udskydelser af den type før, i andre regelsæt. Den typiske konsekvens er ikke at organisationer bruger tiden bedre — det er at de bruger den slet ikke, og står samme sted 18 måneder senere med en kortere bane.

## Hvad I konkret bør gøre nu (september 2026)

1. **Kortlæg jeres AI-anvendelse** — hvilke systemer bruger eller udvikler I, og hvor falder de i risiko-taksonomien? Det er ikke trivielt: et chat-værktøj brugt til intern videnssøgning er typisk *low risk*, men det samme værktøj brugt til at vurdere ansøgere er *høj-risiko*
2. **Tjek artikel 50 mod jeres kundevendte AI** — oplyser I at brugeren taler med et AI-system? Mærker I genereret indhold? Fristen for maskinlæsbar mærkning af eksisterende systemer er 2. december 2026
3. **Verificér AI literacy** — har I dokumenteret at de relevante medarbejdere har det rette kvalifikationsniveau? Hvis ikke, opbyg en simpel proces nu
4. **Stop forbudte praksisser** — hvis I har noget der falder under forbudslisten, skal det være lukket ned. Det er ikke fremtid; det er nutid. Bemærk de to nye kategorier fra omnibus-pakken
5. **Lav klassificeringen til høj-risiko nu, ikke i 2027** — selve compliance-arbejdet kan fases, men I kan ikke planlægge det før I ved hvad der er i scope
6. **Hold øje med nationale myndigheders præciseringer** — Kommissionens guidance og de danske myndigheders udmeldinger ændrer fortolkningen løbende, og flere medlemsstater er stadig i gang med at udpege kompetente myndigheder

## Hvad det IKKE er

AI Act er **ikke** en "alt AI er nu reguleret hårdt"-lov. Langt det meste AI — interne assistenter, kode-completion, RAG-baseret videnssøgning, marketing-automation, søgning, anbefaling med lav indflydelse — er **low risk** og har minimale formelle krav ud over transparens og AI literacy.

Det er heller **ikke** en erstatning for GDPR. Hvis I behandler personoplysninger med AI, gælder GDPR fortsat fuldt ud. AI Act lægger sig oveni for de højest-risiko use cases.

Og udskydelsen er **ikke** et signal om at reguleringen bliver rullet tilbage. Bilag III står uændret; det er kun kalenderen der flyttede sig.

## Hvis I står med en konkret vurdering

Det her er den ene gang hvor det er værd at få et udefra-blik. En gap-analyse skal:

1. Klassificere hvert AI-system i jeres organisation
2. Mappe det mod Bilag III, forbudslisten og artikel 50
3. Identificere konkrete manglende governance-elementer
4. Prioritere hvad der skal være på plads inden 2. december 2026 (transparens) og 2. december 2027 (høj-risiko)

[Sig til hvis I står med den vurdering](/#kontakt) — jeg laver dem som korte, fokuserede forløb (typisk 1-2 uger), ikke åbne consulting-projekter.
