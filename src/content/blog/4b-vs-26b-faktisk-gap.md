---
title: "4B vs 26B: kun 1.89 procentpoint gap — fra mine egne tests"
description: "Standard-antagelsen er 'brug den største model der passer'. 350+ tests fra eget eval-framework viser at sandheden er mere interessant — og at små lokale modeller ofte er det rigtige valg."
date: 2026-05-10
tags: ["LLM", "Lokale modeller", "Gemma", "Benchmarks", "Cost"]
readingTime: "6 min"
---

Den default-antagelse jeg møder mest i AI-projekter er en enkelt sætning: *"vi bruger den største model der passer på hardwaren"*. Det lyder fornuftigt — bigger is better, ikke?

Mine egne tests siger noget andet. Jeg har bygget et internt eval-framework med 350+ spørgsmål fordelt på infrastruktur, udvikling, arkitektur og cross-domain scenarier. Hver model køres 3 gange og bedømmes af to parallelle Claude Opus-judges per kørsel. Det er ikke benchmarks fra Hugging Face leaderboards — det er spørgsmål der matcher det reelle arbejde modellerne skal lave.

Resultatet for to Gemma 4-konfigurationer på samme hardware:

| Model | Score | Spread (3 runs) |
|---|---|---|
| **Gemma 4 26B Q6_K** | **98.56 %** | 0.67pp |
| **Gemma 4 4B BF16** | **96.67 %** | 1.62pp |

**Gabet: 1.89 procentpoint.** På et 350-spørgsmåls testsæt, vurderet af to uafhængige frontier-judges. Det er meget mindre end de fleste forventer.

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
| Cross-domain scenarier | ~97 % | ~95 % | −2pp |

Stort set hele gabet kommer fra ét sted: **kode-tunge generations-opgaver** i Part B af scenarie-chunken. Der scorer 26B 80 % og 4B kun 55 % — det er det enkelte sted hvor størrelsen matter for alvor. Skal modellen skrive en komplet Terraform-modul fra bunden? Brug 26B. Skal den klassificere, opsummere, hente fakta, formatere data, eller drive en RAG-bot? 4B er fint.

## Den skjulte gevinst: parallelitet

Pris-pr-token er ikke det interessante tal når man kører lokalt. Det interessante tal er **hvor mange concurrent sessioner kan du køre på samme GPU**.

På den hardware jeg har testet på:

- **26B Q6_K**: 2 parallelle slots × 229k context
- **4B BF16**: **10 parallelle slots × 131k context**

Det er **5× så mange samtidige agent-sessioner** for under 2 procentpoints kvalitetstab. For et chatbot-baseret produkt eller en agent-flåde der servicerer mange brugere er det en game-changer.

## Et par andre fund jeg ikke havde forventet

### 31B slår ikke 26B

Jeg testede en 31B-konfiguration med både Q4_K_M og Q5_K_M kvantisering, i håb om at de ekstra parametre ville hjælpe. **De gjorde det ikke.** Begge scorede inden for støj af 26B (96.97-97.08 %), og **Part B kode-skrivning var faktisk værre** end 26B (65-67 % vs 73 %). Samme broken AWS provider DSL, ufuldstændige Terraform-scaffolds, tynde Ansible playbooks.

Det her er en **model-arkitektur grænse**, ikke et kvantiserings-problem. Konsekvens: invester ikke i større GPU'er udelukkende for at køre 31B i stedet for 26B på samme opgave. Pengene er bedre brugt på flere instanser af 26B — eller på 4B'er hvis throughput er flaskehalsen.

### Quantization matters mere end folk tror

Jeg testede 26B med Q5_K_L (mindre vægte → plads til mere context: 524k vs 458k). Resultatet: **Part B regresserede 15 procentpoint** vs Q6_K. Context-gevinsten var ikke værd at tabe så meget kvalitet.

Læring: **Q6_K er sweet spot for 26B-modeller**. Spar dig selv eksperimentet med aggressive kvantiseringer indtil du har en konkret grund.

### TurboQuant KV gør ikke ondt

Jeg kører turbo4 KV-cache (en variant af Q4 quantization for KV-cache i llama.cpp's turbo-fork). Forventningen var en lille kvalitetshit. **Reel måling: ingen detekterbar regression**. Du får q8-niveau kvalitet med q4-fodaftryk. Hvis du kører lokalt med begrænset VRAM, er det her en gratis frokost.

## "Alternative acceptable" — det interessante mønster

I evalueringen flagger judges når en model løser et problem **anderledes end reference-svaret men stadig korrekt**. På 4B-modellen er denne rate **22.1 %** — i én kørsel helt op på 28 %.

Det betyder: 4B'en finder ofte sin egen vej til det rigtige svar i stedet for at gentage reference-tankegangen. Det er sundt. Det betyder også at små modeller ikke bare er "lavere kvalitet 26B'er" — de har deres egne tilgange til problemer.

## Den praktiske strategi: rute opgaver, brug ikke én model til alt

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

Resultat på den hardware jeg har: et reelt setup hvor begge modeller kører samtidigt — 26B på én GPU-node, 4B med 10 slots på en anden — og agenterne routes efter opgave-type. Det er den faktiske produktions-konfiguration, ikke teori.

## Hvornår skal du så *ikke* gå med en lille model?

Vær ærlig om grænserne:

- **Hvis kvaliteten på Part B-niveau opgaver er forretningskritisk** (finansielle beregninger, kode der ryger direkte i produktion uden review, juridisk tekst) — så betyder de 1.89pp meget mere end gennemsnittet antyder. Gå med den større model.
- **Hvis du har frit valg af cloud frontier-modeller** (Claude, GPT) og de er compliance-tilladt — så er en frontier-model stadig kvalitetsmæssigt et niveau over selv 26B. Hosting er kun valget hvis data-sovereignty eller cost-volumen presser.
- **Hvis brugerne forventer "ChatGPT-niveau" konversation** — frontier-modeller er stadig mere natural og charmerende. Lokale modeller virker, men man kan ofte mærke at det ikke er Claude.

## Bottom line

"Brug den største model der passer" er den dyreste default i AI-infrastruktur. Den koster GPU-investeringer der kunne være brugt smartere, og den lukker døren for use-cases hvor parallelitet er mere værd end et par procentpoint.

Mit konkrete råd: **mål før du beslutter**. Byg et lille eval-framework der dækker jeres faktiske use-cases (ikke bare standard-benchmarks). Test både den store og den lille model. Mål gabet på *jeres* opgaver — det er sandsynligvis mindre end du tror.

Og når I først har det data: ret model-valget efter opgave-typen, ikke efter en standardantagelse.

---

Står I over for at vælge mellem self-hosted modeller? [Jeg hjælper gerne med eval og model-routing](/#kontakt).
