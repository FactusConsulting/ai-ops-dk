---
title: "4B vs 26B: kun 1.89 procentpoint gap — fra mine egne tests"
description: "Standard-antagelsen er 'brug den største model der passer'. 350+ tests fra eget eval-framework viser at sandheden er mere interessant — og at små lokale modeller ofte er 'godt nok' til opgaven og dermed kan være det rigtige valg."
date: 2026-05-10
updated: 2026-05-12
tags: ["LLM", "Lokale modeller", "Gemma", "Benchmarks", "Cost"]
readingTime: "6 min"
---

Den default-antagelse jeg møder mest i AI-projekter er en enkelt sætning: *"vi bruger den største model der passer på hardwaren"*. Det lyder fornuftigt — bigger is better, ikke?

Mine egne tests siger noget andet. Jeg har bygget et internt eval-framework med 350+ spørgsmål fordelt på infrastruktur, udvikling, arkitektur og cross-domain scenarier. Hver model køres 3 gange og bedømmes af to parallelle Claude Opus-judges per kørsel. Det er ikke benchmarks fra Hugging Face leaderboards — det er spørgsmål der matcher det reelle arbejde modellerne skal lave.

Og vigtigt for hvad jeg er på vej til: **det hele kører på lokal hardware der har kostet mindre end 10.000 kr.** Ikke et datacenter-rack af H100'ere. En enkelt forbrugerklasse-GPU pr. node, llama.cpp og en smule tuning. Det er det realistiske setup for mange små og mellemstore organisationer der gerne vil køre AI lokalt — og det er det setup tallene nedenfor er målt på.

> **Metodeboks**
>
> - **Eval-sæt:** 350+ spørgsmål fordelt på 9 chunks — Networking, Linux, Kubernetes, Dev, OpenTofu, Ansible, Go, Rust, .NET, Python, JS, Bash, PowerShell, app-arkitektur, on-prem, cloud, OT, samt cross-domain scenarier opdelt i Part A (analyse) / Part B (kode/IaC fra scratch) / Part C (design)
> - **Hardware:** forbrugerklasse-GPU pr. node (under 10.000 kr/node)
> - **Inference runtime:** llama.cpp turbo-fork (build b8753 ved publish-tidspunkt) med turbo4 KV-cache
> - **Quantization:** 26B kørt i Q6_K (production), 4B kørt i BF16; 31B testet i Q4_K_M og Q5_K_M; også Q5_K_L testet på 26B til sammenligning
> - **Sampling:** temperatur 0 for deterministiske runs hvor muligt; spread måles på tværs af 3 kørsler pr. konfiguration
> - **Judges:** to parallelle Claude Opus 4.6-judges per kørsel, scoring via struktureret rubric (Pass / Partial / Fail + `alternative_acceptable`-flag); final score = mean(Judge A, Judge B) per spørgsmål
> - **Inter-judge agreement:** typisk 94-98 %; ved lavere agreement bruges super-judge
> - **Setup-detaljer holdes opdateret i mit interne eval-repo** — sig til hvis du vil have prompt-template, scoring-rubric eller anonymiserede eksempler fra et givet spørgsmål
>
> Det her er *mit* eval-sæt på *min* hardware. De konkrete tal er derfor ikke en universel benchmark — de er en strukturel observation: gabet på reelle workloads er ofte mindre end den intuitive forventning.

Resultatet for to Gemma 4-konfigurationer på samme hardware:

| Model | Score | Spread (3 runs) |
|---|---|---|
| **Gemma 4 26B A4B (Q6_K)** | **98.56 %** | 0.67pp |
| **Gemma 4 E4B (BF16)** | **96.67 %** | 1.62pp |

**Gabet: 1.89 procentpoint i mit eval-sæt.** På et 350-spørgsmåls testsæt, vurderet af to uafhængige frontier-judges. Det er meget mindre end de fleste forventer — men det er stadig *mit* eval-sæt på *mine* opgaver. Hovedpointen er at gabet på reelle workloads ofte er mindre end den intuitive forventning. Konkrete tal kommer ud af konkrete tests.

## Hvor er det 1.89pp egentlig forsvundet?

Per domæne:

| Område | 26B | 4B | Forskel |
|---|---|---|---|
| Networking + Linux | ~98 % | ~96 % | −2pp |
| Kubernetes + Dev | ~99 % | ~97 % | −2pp |
| OpenTofu + Ansible | ~97 % | ~94 % | −3pp |
| Go + Rust | ~99 % | ~98 % | −1pp |
| .NET + Python | ~99 % | ~97 % | −2pp |
| JS + Bash + PowerShell | ~98 % | ~96 % | −2pp |
| App-arkitektur | ~99 % | ~97 % | −2pp |
| Cloud + OT | ~99 % | ~98 % | −1pp |
| Cross-domain Part A (analyse) | ~100 % | ~100 % | 0pp |
| Cross-domain Part B (**kode/IaC**) | **~80 %** | **~55 %** | **−25pp** |
| Cross-domain Part C (design) | ~100 % | ~100 % | 0pp |

Det er **én række i tabellen** der bryder mønstret. På alt det andet — analyse, design, klassificering, sprog-specifik kode-forståelse, infrastruktur-spørgsmål — er forskellen 1-3 procentpoint. På Part B, **kode-tunge generations-opgaver fra scratch** (skriv et komplet Terraform-modul, en fuld Ansible-playbook, et færdigt Go-program), kollapser 4B'en til 55 % mens 26B holder 80 %.

Det er det enkelte sted hvor størrelsen matter for alvor. Skal modellen skrive komplet IaC eller produktionsklar kode fra bunden? Brug 26B (eller en frontier-model). Skal den klassificere, opsummere, hente fakta, formatere data, drive en RAG-bot eller analysere et givent stykke kode? 4B er fint.

## Den skjulte gevinst: parallelitet

Pris-pr-token er ikke det interessante tal når man kører lokalt. Det interessante tal er **hvor mange concurrent sessioner kan du køre på samme GPU**.

På den hardware jeg har testet på:

- **26B Q6_K**: 2 parallelle slots × 229k context
- **4B BF16**: **10 parallelle slots × 131k context**

Det er **5× så mange samtidige agent-sessioner** for under 2 procentpoints kvalitetstab. For et chatbot-baseret produkt eller en agent-flåde der servicerer mange brugere er det en game-changer.

## Et par andre fund jeg ikke havde forventet

### 31B slog ikke 26B i min konfiguration

Jeg testede en 31B-konfiguration med både Q4_K_M og Q5_K_M kvantisering, i håb om at de ekstra parametre ville hjælpe. **De gjorde det ikke.** Begge scorede inden for støj af 26B (96.97-97.08 %), og **Part B kode-skrivning var faktisk værre** end 26B (65-67 % vs 73 %). Samme broken AWS provider DSL, ufuldstændige Terraform-scaffolds, tynde Ansible playbooks.

Mit take: i denne hardware-config og med disse kvantiseringer er 31B ikke værd at investere i over 26B til min use case. Google positionerer 31B dense som stærkere fine-tuning foundation, så hvis I har et fine-tuning-flow er regnestykket muligvis anderledes. **Test selv inden I køber GPU'er**.

### Quantization matters mere end folk tror

Jeg testede 26B med Q5_K_L (mindre vægte → plads til mere context: 524k vs 458k). Resultatet: **Part B regresserede 15 procentpoint** vs Q6_K. Context-gevinsten var ikke værd at tabe så meget kvalitet.

Læring for *denne* model på *denne* hardware: Q6_K var det bedre tradeoff. Den læring generaliserer ikke automatisk til andre modeller, andre kvantiserings-formater eller anden inference-engine — sweet spot er noget I selv skal måle. Men spar jer selv eksperimentet med aggressive kvantiseringer indtil I har en konkret grund.

### TurboQuant KV — lovende, men test selv

Jeg kører turbo4 KV-cache (en variant af Q4 quantization for KV-cache i llama.cpp's turbo-fork). Forventningen var en lille kvalitetshit. **Reel måling i mit eval-sæt: ingen detekterbar regression**.

Det er et lovende resultat, men ikke et generelt løfte. KV-cache quantization er stadig et område i hurtig udvikling, og effekten kan variere med model, context-længde, workload-type og throughput-mønster (lange contexts kan give dequantization-overhead). Hvis I overvejer det: kør jeres egne målinger på jeres egne workloads, særligt på lange contexts.

## "Alternative acceptable" — det interessante mønster

I evalueringen flagger judges når en model løser et problem **anderledes end reference-svaret men stadig korrekt**. På 4B-modellen er denne rate **22.1 %** — i én kørsel helt op på 28 %.

Det betyder: 4B'en finder ofte sin egen vej til det rigtige svar i stedet for at gentage reference-tankegangen. Det er sundt. Det betyder også at små modeller ikke bare er "lavere kvalitet 26B'er" — de har deres egne tilgange til problemer.

## Q1 2026 alene har flyttet hegnspælene markant

En af grundene til at "brug den største model der passer"-defaulten er forældet er at **lokale modeller har bevæget sig ekstremt hurtigt det sidste kvartal**. Bare i Q1 2026 er der landet ting der ville have været science fiction for 6 måneder siden:

- **Gemma 4-familien** — Google's officielle navngivning inkluderer **E2B**, **E4B**, **26B A4B** (MoE med ~4B aktive parametre) og **31B Dense**. E4B scorer 96.67 % på mit eval-framework; et 4B-niveau model fra 2024 ville have ligget i 70-80 %-området på samme spørgsmål
- **TurboQuant KV-cache** (Q4-fodaftryk, Q8-kvalitet) — gør det realistisk at have store contexts på begrænset VRAM uden at miste kvalitet
- **Multi-Token Prediction (MTP)** lander i vLLM for understøttede modeller — markant throughput-løft
- **Mistral Small-familien** har vist at mindre modeller kan være stærke til latency- og cost-følsomme workloads, men konkrete modelnavne bør evalueres løbende — Mistral udfaser ældre Small-versioner hurtigt, og iterationshastigheden er præcis hvorfor en specifik version-claim her ville være forældet inden artiklen er læst færdig
- **Qwen3-familien** har stærk multilingual dækning, hvilket historisk har været en svaghed ved lokale modeller. Men dansk kvalitet bør stadig valideres i egne domænetests — der er ikke nødvendigvis fuld paritet med engelsk endnu
- **Distilleret Opus-niveau ræsonnement** ned til 27B parametre i flere eksperimentelle releases (kvalitet stadig variabel, men retningen er klar)

Det betyder også at en tommelfingerregel "lokal model = -10 procentpoint vs frontier" ikke længere holder. På mange opgavetyper er gabet under 5 pp — og krymper hver måned. Hvis I traf jeres "vi går med cloud frontier"-beslutning for 12 måneder siden ud fra dårlig kvalitet på lokale modeller, er det værd at gentage øvelsen nu. Tallene er anderledes.

## Den praktiske strategi: fordel opgaverne, brug ikke én model til alt

Det her er hvor det bliver interessant. I stedet for at vælge én model og bruge den til alt, opdeler jeg opgaverne efter hvad der er flaskehalsen:

**Brug 26B til:**
- Prompt-tunge agenter (lead-dev, architect, security review)
- Single-agent sessioner med kompleks code-generation
- Ting hvor Part B-typen kvalitet betyder noget

**Brug 4B til:**
- Mange parallelle agent-sessioner
- RAG-baserede chatbots (retrieval gør det grove arbejde, modellen syntetiserer)
- Klassificering, opsummering, formattering, fakta-opslag
- Workflow-automation hvor outputtet er struktureret data

Resultat på den hardware jeg har: et reelt setup hvor begge modeller kører samtidigt — 26B på én GPU-node, 4B med 10 slots på en anden — og agenterne fordeles til den rigtige model efter opgave-type. Det er den faktiske produktions-konfiguration, ikke teori.

## Hvornår skal du så *ikke* gå med en lille model?

Vær ærlig om grænserne:

- **Hvis kvaliteten på Part B-niveau opgaver er forretningskritisk** (finansielle beregninger, kode der ryger direkte i produktion uden review, juridisk tekst) — så betyder de 1.89pp meget mere end gennemsnittet antyder. Gå med den større model.
- **Hvis du har frit valg af cloud frontier-modeller** (Claude, GPT) og de er compliance-tilladt — så er en frontier-model stadig kvalitetsmæssigt et niveau over selv 26B. Hosting er kun valget hvis data-sovereignty eller cost-volumen presser.
- **Hvis brugerne forventer "ChatGPT-niveau" konversation** — frontier-modeller er stadig mere natural og charmerende. Lokale modeller virker, men man kan ofte mærke at det ikke er Claude.

## Bottom line

"Brug den største model der passer" er ikke længere en sikker default i AI-infrastruktur. Den koster GPU-investeringer der kunne være brugt smartere, og den lukker døren for use-cases hvor parallelitet er mere værd end et par procentpoint. Små lokale modeller er ikke det rigtige valg til alt — men de er ofte "**godt nok**" til en konkret opgave, og det skifter regnestykket markant.

Og hold den her i mente: **alt det her er målt på hardware for under 10.000 kr.** Ikke H100-rack, ikke MI300X-kapacitet — bare en enkelt forbrugerklasse-GPU pr. node og et godt setup omkring den. Hvis det er hvad man kan opnå for under en månedsløn i hardware-investering, så er der ikke meget grund til at antage at "lokal AI" er forbeholdt store organisationer.

Mit konkrete råd: **mål før du beslutter**. Byg et lille eval-framework der dækker jeres faktiske use-cases (ikke bare standard-benchmarks). Test både den store og den lille model. Mål gabet på *jeres* opgaver — det er sandsynligvis mindre end du tror.

Og når I først har det data: ret model-valget efter opgave-typen, ikke efter en standardantagelse.

---

Står I over for at vælge mellem self-hosted modeller? [Jeg hjælper gerne med eval og model-routing](/#kontakt).
