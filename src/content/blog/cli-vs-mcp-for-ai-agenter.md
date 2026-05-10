---
title: "Hvorfor en god CLI slår MCP for AI-agenter"
description: "MCP fik al hypen, men i praksis er en velbygget CLI både billigere, hurtigere og mere agent-venlig. Her er hvorfor — med konkrete eksempler."
date: 2026-05-10
tags: ["AI-agenter", "MCP", "CLI", "Tooling"]
readingTime: "7 min"
---

MCP — Model Context Protocol — fik al hypen da det landede i 2024. En standardiseret protokol så agenter kunne tale med eksterne værktøjer. God idé på papir.

Men efter halvandet års arbejde med både MCP-servere og almindelige CLI-tools i agent-flows er min konklusion klar: **for de fleste agent-opgaver er en velbygget CLI federe end en MCP-server**. Ikke som princip, men af konkrete, målbare grunde.

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

Når du connecter en MCP-server, lander hele dens tool-katalog i agentens kontekst. Hvert tool-schema. Hver beskrivelse. Hele tiden. Også de 80% af værktøjer agenten ikke skal bruge til netop dén opgave.

CLIs fungerer omvendt: agenten kalder `tool --help` *kun* når det er relevant. Pull frem for push. Det er en stor besparelse i context window — og context window er den dyreste reelle ressource i en agent-session, både i kroner og i kvalitet (jo længere kontekst, jo mere "tabt" agent).

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

## Hvornår MCP stadig giver mening

MCP er ikke værdiløs. Det er det rigtige valg når:

- Værktøjet er **fundamentalt stateful og interaktivt** — fx en databasesession med transaktion eller en igangværende chat med en ekstern API
- Værktøjet kører i et miljø **uden shell** — browser-baseret agent, mobile, en Sandbox uden /bin/sh
- Du har brug for **strukturerede streaming-events** med protokol-niveau garanti (live progress fra et langt job med struktureret feedback agenten skal handle på undervejs)
- Tool'et **eksisterer ikke som CLI** og du har ikke kapacitet til at bygge en

Det er bare ikke standardtilfældet. I 2026 er MCP undtagelsen — ikke reglen.

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

MCP løser et reelt problem — standardiseret tool-discovery for agenter — men prisen er høj: tokens, kompleksitet, og en udvanding af 60 års shell-konventioner der allerede virker.

I de fleste praktiske scenarier får du mere ud af at gøre dine eksisterende CLIs *agent-venlige* end at bygge en MCP-server. Det er billigere, mere komposabelt, og det dur både til mennesker og agenter på samme tid.

Står I med et internt værktøj der gerne skulle kunne bruges af både udviklere og AI-agenter? [Jeg hjælper gerne med design og review](/#kontakt).
