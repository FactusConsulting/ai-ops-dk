---
title: "Hvorfor en god CLI slår MCP for AI-agenter"
description: "MCP fik al hypen, men for det meste lokale udviklingsarbejde er en velbygget CLI både billigere, hurtigere og mere agent-venlig. Her er hvorfor — og hvor MCP til gengæld vinder."
date: 2026-05-10
tags: ["AI-agenter", "MCP", "CLI", "Tooling"]
readingTime: "7 min"
---

MCP — Model Context Protocol — fik al hypen da det landede i 2024. En standardiseret protokol så agenter kunne tale med eksterne værktøjer. God idé på papir.

Men efter halvandet års arbejde med både MCP-servere og almindelige CLI-tools i agent-flows er min konklusion klar: **for det meste lokale udviklingsarbejde er en velbygget CLI federe end en MCP-server**. Ikke som princip — MCP har sine reelle styrker, særligt på governance og eksterne integrationer (det vender vi tilbage til) — men af konkrete, målbare grunde i de scenarier hvor man har valget.

Her er dem.

## 1. Pipes sparer tokens — en hel masse

Det her er det mest undervurderede argument. Hvis en agent kan køre `cmd1 | grep error | jq '.[]' | head -20` i ét tool-call, sparer den massive mængder tokens sammenlignet med MCP-flowet hvor hver step bliver et separat round-trip gennem LLM-kontekst:

- **CLI-flow:** ét tool-call. Output filtreres lokalt før agenten overhovedet ser det.
- **MCP-flow:** call A → fuld output ind i kontekst → reason → call B → ind i kontekst igen → reason → call C ...

På en stor logfil eller et `kubectl get`-output kan forskellen være 50.000 tokens vs. 200 tokens. Det er reel pris, reel latency, og reel risiko for at agenten taber tråden midt i en stor kontekst.

Konkret eksempel — find de sidste 5 fejl på tværs af pods:

```sh
kubectl logs --tail=10000 -l app=foo | grep -E "ERROR|FATAL" | tail -5
```

Tre værktøjer, ét call. Kun de 5 relevante linjer rammer agentens kontekst. Med MCP skulle hver mellem-output passere gennem LLM'en for at bestemme næste skridt.

## 2. CLIs kan have AI-bevidst help indbygget

Det her er et design-mønster jeg er begyndt at bygge ind i nye værktøjer: en separat help-tekst skrevet specifikt til agenter. Det er bare tekst — men det betyder at agenten kan finde ud af værktøjet selv:

```
$ mytool --help-ai

When called by an AI agent, prefer:
  - mytool list --json | jq '.items[] | select(.status=="failed")'
  - mytool diagnose <id> --include-logs    (returns ~200 lines, safe to read)

Avoid:
  - --verbose without a filter             (returns 50k+ lines, will blow context)
  - mytool watch                           (long-running; use 'snapshot' instead)

Common patterns:
  - One-shot status:  mytool status --json
  - Batch operation:  mytool apply -f manifest.yaml --quiet --json-summary
```

Resultatet: agenten lærer at bruge værktøjet *korrekt og effektivt* — fra værktøjet selv. Det er en form for runtime-discoverability MCP ikke kan matche, fordi MCP-schemas er statiske og loadet upfront uanset opgave.

## 3. Help er pull, ikke push

I de fleste MCP-implementeringer i dag — særligt med default-clients — bliver hele tool-kataloget exposed til LLM'en når en server connectes. Hvert tool-schema, hver beskrivelse, i context fra første token. Også de 80 % af værktøjer agenten ikke skal bruge til netop dén opgave.

Protokollen tvinger det ikke — lazy-loading-mønstre er på vej (Claude Code's deferred tools / `ToolSearch` er et tidligt eksempel) — men eager loading er stadig den udbredte standard, og det er det de fleste agent-setups ender med i praksis.

CLIs fungerer omvendt by design: agenten kalder `tool --help` *kun* når det er relevant. Pull frem for push. Det er en stor besparelse i context window — og context window er den dyreste reelle ressource i en agent-session, både i kroner og i kvalitet (jo længere kontekst, jo mere "tabt" agent).

## 4. Standard streams + exit codes = robust fejlhåndtering

CLI'er har 60 års historie i at signalere succes og fejl klart:

- `stdout` for resultater
- `stderr` for fejl og status
- Exit code = 0 (succes) eller != 0 (fejl)

Agenten kan trivielt detektere fejl: `cmd && echo OK || echo FAIL`, eller bare se på exit-koden. MCP-servere skal hver især implementere fejl-konventioner — og i praksis lander det ofte som "200 OK med en `error`-key i JSON-svaret" som agenten skal parse og forstå semantisk.

Forskellen virker lille. I praksis er den enorm: en agent der falder over en uventet fejl-format bruger 5-10 turn på at finde ud af om operationen faktisk fejlede.

## 5. Universalitet — alt findes allerede som CLI

Stort set hvert eneste dev-værktøj har en CLI. `git`, `kubectl`, `gh`, `aws`, `psql`, `terraform`, `docker`, `jq`, `curl`, `rg`, `fd`, `bat` ... Agenten kan bruge dem **uden at nogen skal bygge en MCP-wrapper først**.

MCP-økosystemet er stadig sparsomt i 2026. Du har en håndfuld populære servere (filesystem, git, GitHub), men de fleste interne værktøjer har ingen MCP-version — og når du bygger din egen, ender du ofte med en tynd wrapper rundt om den underliggende CLI. På det tidspunkt har du tilføjet et lag kompleksitet uden at vinde noget.

## 6. Filsystemet er agentens billige, vedvarende hukommelse

Skriv et stort søgeresultat til `/tmp/findings.json`. Lad agenten referere det senere med `jq '.matches[0:5]'` eller `head -50`. Du har lige fået persistent state mellem tool-calls — uden at det fylder context window.

Eller endnu enklere: `tool > /tmp/output.txt && wc -l /tmp/output.txt`. Agenten ser kun "12.847 linjer", ikke indholdet. Den læser detaljerne kun hvis næste skridt kræver det.

MCP har ingen tilsvarende billig persistent buffer. Hver call returnerer sit fulde output til agentens kontekst — uanset om agenten faktisk havde brug for det.

## 7. Reproducerbarhed — agenter og mennesker bruger samme runbook

En agent der løser et problem ved at køre `kubectl get pods -l app=foo -o jsonpath='{.items[*].status.phase}'` har just leveret et reproducerbart shell-kommando der kan kopieres direkte ind i en runbook, et postmortem eller en kollegas terminal.

Med MCP er flowet usynligt — det sker indeni protokollen, og en human reviewer skal forstå MCP-laget for at debugge hvad der skete. CLI-flowet er gennemsigtigt: jeg kan **selv køre samme kommando** for at verificere agentens arbejde.

## 8. Composability — også med tools agenten ikke kender på forhånd

`gh pr list --json number,title | jq '.[] | select(.title | contains("WIP"))' | head -5`

Det er en komposition af tre værktøjer der intet ved om hinanden, koblet sammen via en standardiseret tekst-protokol (linjer på stdout). Agenten kan tænke i de byggeklodser den allerede kender og kombinere dem ad hoc — uden at nogen har designet et MCP-tool kaldet `find-wip-prs`.

Den fleksibilitet kommer gratis med shell. MCP kræver at *nogen* tænker hvert composition-mønster ud på forhånd og bygger det som tool.

## Hvor MCP er det rigtige valg

Så langt om hvor CLI vinder. MCP er ikke værdiløs — det er reelt stærkere end CLI på flere fronter, og dem er værd at fremhæve:

- **Governance og sikkerhed.** Capability negotiation, struktureret OAuth, scope-baserede permissions, audit-baseret adgangsstyring. CLIs kræver til gengæld sandboxing (Docker, gVisor eller eksplicit pre-approval-flow på shell-kommandoer) for at være enterprise-trygge. Hvis I står med regulerede data, en compliance-bagage, eller en agent der skal kunne handle på vegne af mange brugere med forskellige tilladelser, vinder MCP klart
- **Eksterne SaaS-integrationer.** Når agenten skal tale med Notion, Slack, Salesforce, GitHub Enterprise eller en intern microservice over OAuth, er MCP designet til netop det — protokollen håndterer auth-flow, tilladelses-scoping og struktureret API-kontrakt på en måde der ville være ad-hoc og fejlbarslig med shell
- **Stateful, interaktive sessioner** — fx en databasesession med transaktion eller en igangværende multi-step API-flow med løbende state
- **Miljøer uden shell** — browser-baseret agent, mobile, en sandbox uden `/bin/sh`
- **Strukturerede streaming-events** med protokol-niveau garanti (live progress fra et langt job hvor agenten skal handle på struktureret feedback undervejs)

## Inner loop vs outer loop — den klare model

Den mest brugbare måde at tænke om valget på er at skelne mellem **inner loop** og **outer loop**:

- **Inner loop** er det lokale udviklingsarbejde — filsystem, git, build, test, linter, lokale dev-tools, debug-output, container-introspection, database-eksplorering. Her er CLI klart bedst. Værktøjerne er kendt af LLM'en fra dens træningsdata, kompositioner sker via shell, output går gennem stdout, ingen auth-overhead, ingen protokol-lag
- **Outer loop** er det eksterne — SaaS-tjenester, interne microservices, prod-databaser med følsomme data, regulerede systemer, agenter der handler på vegne af brugere. Her er MCP designet til at vinde — auth, capability negotiation, audit, struktureret kontrakt

I praksis rammer de fleste reelle agent-flows begge: man læser en intern wiki (outer / MCP), trækker noget viden ud, redigerer kode lokalt (inner / CLI), tester, committer og deployer via en gated CI-pipeline (outer / MCP igen). Pointen er ikke at vælge den ene af dem — pointen er at **bruge dem hvor de hører hjemme** og ikke tvinge MCP ind i inner loop fordi det føles "mere moderne", eller omvendt at lade en CLI-agent hamre på en prod-database uden auth-lag fordi det er hurtigere at sætte op.

## Konkret råd: byg CLIs med agenter i tankerne

Hvis du bygger interne værktøjer til et team der bruger AI-agenter — eller forventer at gøre det inden for de næste 12 måneder — så design CLI'en med agent-brug i tankerne fra dag ét. Konkret:

1. **`--json` på alt** der returnerer struktureret data. Lad agenten parse med `jq` frem for at gætte på tabel-formattering.
2. **Stille mode by default**, eller mindst en `--quiet` flag. Minimer støj — lad agenten bede om mere når det er relevant.
3. **Subcommands der gør én ting**. Composable frem for monolitisk. `tool list`, `tool inspect <id>`, `tool diagnose <id>` — ikke `tool --do-everything`.
4. **Exit codes der betyder noget**. Ikke `exit 0` på fejl. Brug forskellige koder for forskellige fejlklasser hvis det giver mening (62 for "not found", 78 for "permission denied", osv.).
5. **`--help-ai` eller en sektion i normal `--help`** der nævner agent-best-practices: hvilke flags spammer kontekst, hvilke kommandoer er sikre at køre på autopilot, hvilke kræver bekræftelse.
6. **Output med stabile feltnavne** — agenten lærer dem én gang og bruger dem i flere sessioner.

Og når du står over for et nyt internt værktøj: spørg "hvordan ville en agent bruge det her smartest?" som en del af UX-arbejdet. Det gør tool'et bedre for både agenter *og* mennesker.

## Bottom line

MCP løser et reelt problem — standardiseret tool-discovery, governance og auth for agenter der skal tale med eksterne systemer. Men prisen er høj i context-tokens, kompleksitet og setup-overhead, og prisen er ikke det værd hvis du bare prøver at give din agent adgang til lokale udviklings-værktøjer der allerede har en udmærket CLI.

Tommelfingerreglen jeg er endt med: **start CLI-first, læg MCP til hvor det giver reel governance- eller integrationsværdi.** Inner loop hører til shell. Outer loop kan ofte bedst leveres via MCP. Den ene udelukker ikke den anden — pointen er at vælge bevidst i stedet for at default til "alt skal være MCP fordi det er det nye".

Står I med et internt værktøj der gerne skulle kunne bruges af både udviklere og AI-agenter? [Jeg hjælper gerne med design og review](/#kontakt).
