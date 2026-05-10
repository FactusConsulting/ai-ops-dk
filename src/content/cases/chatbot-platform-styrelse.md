---
title: "Modulær chatbot-platform med RAG og lokale modeller"
summary: "Designede og byggede en sikker, modulær platform der gør det muligt at udrulle nye chatbots oven på en fælles RAG-, model- og sikkerhedsbase — fra intern dokumentsøgning til borgerrettet juridisk bot."
industry: "Offentlig sektor"
duration: "Igangværende"
date: 2026-04-25
role: "Arkitekt og hands-on udvikler"
technologies:
  - "FastAPI (RAG-gateway)"
  - "Postgres + pgvector (HNSW + tsvector)"
  - "BAAI/bge-m3 embeddings"
  - "BAAI/bge-reranker-v2-m3"
  - "vLLM (FP8 + FP8 KV-cache)"
  - "llama.cpp (GGUF)"
  - "Open WebUI · Caddy"
  - "Gemma 4 (4B / 26B-MoE / 31B)"
  - "Mistral Small · Qwen3"
  - "Turboquants · MTP"
outcomes:
  - value: "2"
    label: "chatbots på fælles platform"
  - value: "4"
    label: "kildetyper i ingestion"
  - value: "100%"
    label: "kan køres lokalt"
---

## Udgangspunktet

Den samme styrelse som i [case 1](/cases/gpu-platform-styrelse) stod over for at skulle udvikle flere forskellige chatbots — nogle internt rettede, andre eksterne. Konkret to i første runde: en **intern** bot der søger i styrelsens egne dokumenter, og en **ekstern** bot rettet mod borgere og virksomheder med opslag i arbejdsmarkedslovgivningen.

At bygge dem fra bunden hver gang ville være spild — og endnu vigtigere: hver bot skulle løse de samme svære problemer (RAG-kvalitet, sikkerhed, audit, model-valg). Der var brug for én platform med modulære byggeklodser, så hver ny chatbot kun behøver tilføje det specifikke i stedet for at genopfinde fundamentet.

## Tilgangen — modulær platform i tre lag

Jeg designede og byggede platformen som en pluggable arkitektur. Tre hovedlag, hvor man for hver ny chatbot kun komponerer det relevante.

### 1. Ingestion-pipeline med pluggable kilder

Et Click-baseret CLI med adapter pr. datakilde:

- **Filer** (PDF, Word, markdown)
- **Confluence**
- **Jira**
- **retsinformation.dk** (drevet af den juridiske bot)

Pipeline: parse → chunk (paragraf-aware, 512 tokens med 64 overlap, tiktoken-tokenized) → embed med multilingual `BAAI/bge-m3` (1024 dim, dansk-kapabel) → upsert med SHA-256 hash-diff. Sidstnævnte betyder at den daglige refresh er **idempotent** — kun det reelt ændrede røres. Billigt at køre, sikkert at gentage.

### 2. RAG-gateway med hybrid retrieval

Den centrale FastAPI-komponent som alle chatbots deler. På hver brugerbesked:

1. Embedding af query (bge-m3)
2. **Hybrid retrieval** — dense (HNSW cosine på pgvector) + sparse (Postgres `tsvector` med dansk konfiguration og GIN-indeks) — fusioneret via Reciprocal Rank Fusion i én CTE
3. **Cross-encoder reranking** (bge-reranker-v2-m3) der reducerer 30 → 6 mest relevante chunks
4. Prompt-konstruktion med tydelig kilde-fence og inline-citationer (`[1]`, `[2]`…)
5. Streaming-svar via SSE med en kildeliste injiceret før `[DONE]`

Vector-laget er bevidst lagt på **Postgres + pgvector** frem for en separat vector-database. Færre bevægelige dele, ACL-modellen kan flettes ind på SQL-niveau, og det skalerer fint i den størrelse vi opererer i.

### 3. Model-runtime — skiftbar pr. chatbot

- **vLLM** med FP8 vægte og FP8 KV-cache som primær motor på de lokale GPU-noder — bedste throughput
- **llama.cpp** med GGUF til sammenlignende test og lavere-kapacitet scenarier
- **OpenRouter** som cloud-fallback i de tilfælde hvor compliance tillader det

Modelevalueringen har spændt **fra 4B op til 31B parametre** — bevidst bredt for at finde den rette balance mellem kvalitet, latency og GPU-forbrug pr. use case. Konkret testet:

- **Gemma 4** i flere konfigurationer: fra den lille 4B (hurtig, billig at køre), over en 26B/4B MoE-variant med sparse activation, til den fulde 31B dense
- **Mistral Small** modeller
- **Qwen3**

For hver kandidat er der eksperimenteret med forskellige **quantization-strategier** og **KV-cache-konfigurationer** — det er ofte her den faktiske forskel mellem en bot der kører og en der ikke gør ligger. Derudover er nyere optimeringer afprøvet: **turboquants** (Q4-niveau quantization med kvalitet tæt på Q8) og **Multi-Token Prediction (MTP)** der øger inferens-throughputen mærkbart på understøttede modeller.

Begge runtimes — **vLLM** og **llama.cpp** — er holdt op imod hinanden så valget pr. chatbot tages på grundlag af reelle målinger frem for default-præferencer.

### 4. Cost og kvalitet — datagrundlag og test-framework

Spørgsmålet "kan denne bot drives på en lille lokal model i stedet for en frontier-API?" er ikke et engangs-svar. Markedet for åbne sprogmodeller flytter sig hver måned, og nye optimeringer (turboquants, MTP, distillation) kommer løbende. En model der ikke holdt for tre måneder siden, kan være den rette i dag — og omvendt.

Derfor er en stor del af leverancen ikke et færdigt model-valg, men det **datagrundlag og evaluerings-framework** styrelsen kan bruge til at træffe denne type beslutninger løbende, også længe efter min involvering. Konkret omfatter det:

- **Domain-specifikke eval-datasets** sammensat sammen med fagpersoner — typiske spørgsmål fra hver bots reelle brugsområde, parret med kuraterede gode svar og kilde-referencer
- **Automatiseret eval-pipeline** der kører en ny model mod hele datasettet uden manuel intervention — én kommando, fuld rapport
- **Kvalitetsmål** der dækker det som faktisk betyder noget for en RAG-bot: groundedness (svar understøttet af kilder), citation coverage, faktuel korrekthed (LLM-as-judge mod gold-svar), refusal-rate på out-of-scope spørgsmål
- **Performance- og cost-tal** pr. model: latency p50/p95, GPU-memory-forbrug, throughput og effektiv pris pr. 1.000 forespørgsler — beregnet både for lokal drift (GPU-amortisering over reel udnyttelse) og cloud-fallback (faktisk token-pris)
- **Sammenlignende rapporter** der gør valget eksplicit: *"Model A er 12 % bedre på groundedness end Model B, men koster 3× så meget i GPU-time — er det værd det?"*

Effekten er strategisk frem for én engangs-besparelse: styrelsen kan løbende kvalificere nye åbne modeller mod deres egne kvalitetskrav uden at skulle starte forfra — og dermed forblive uafhængig af leverandør-trends og hype-cyklusser.

## Sikkerhed for ekstern eksponering

Den eksterne juridiske bot betyder at platformen skal kunne stå alene mod internettet. Jeg har lagt en lagdelt sikkerhedsplan, prioriteret efter reel risiko:

- **Perimeter** — TLS via offentlig CA, WAF foran Caddy, SSO (OIDC mod Entra) foran Open WebUI, mTLS mellem komponenter, egress-allowlist på gateway-containeren
- **Anti-misbrug** — rate limiting pr. bruger og IP, concurrency-cap, max input-længde, daglig token-quota, cost circuit breaker mod cloud-fallback
- **Prompt-injection forsvar** — sanitering allerede ved ingestion (kontroltegn, BiDi-overrides, image-data-URIs, HTML-kommentarer), "sandwich"- og "spotlight"-defence i prompten, output-filter mod system-prompt-læk
- **RAG-grounding-garanti** — citation enforcement (afvisning hvis svar mangler `[N]`-referencer), lav-score reranker-cutoff, groundedness-scoring som efter-svar-step, refusal når query er out-of-scope
- **PII** — Presidio-baseret redaction ved ingestion (CPR, email, telefonnumre), **ACL-aware retrieval** hvor chunks tagges med AD-grupper og JWT-claims joinet i SQL, output-PII-filter på streamen
- **Observability** — struktureret audit log pr. request (bruger, query, retrieved IDs, scores, tokens), alarmer på misbrugs-mønstre, **honeypot-kanarier** i korpus til læk-detektion

Lagene er bevidst prioriteret så den interne bot — med mindre angrebsflade — kan gå i drift først, mens P0-perimeteren færdiggøres til den eksterne lancering.

## Status

Platformen er bygget som **generisk infrastruktur** der kan genbruges for fremtidige chatbots — én base, mange bots. Første to er under implementering:

- **Intern videnssøgning** i styrelsens egne dokumenter (Confluence, Jira, fildrev)
- **Borgerrettet bot** med opslag i arbejdsmarkedslovgivningen

Selve platform-laget er funktionelt og dækker hele flowet fra ingestion til streaming-svar. Næste milepæl er P0-sikkerhedslaget før den borgerrettede bot åbnes mod internettet, og afsluttende model-evaluering for at låse den endelige model-mix pr. bot.

## Hvad jeg leverede

- Arkitektur og design af modulær chatbot-platform
- Hands-on implementering af RAG-gateway med hybrid retrieval og reranking
- Ingestion-pipeline med pluggable kilde-adaptere og idempotent daglig refresh
- Test-framework og datagrundlag der gør styrelsen i stand til selv at evaluere fremtidige selvhostede modeller
- Sammenligning og evaluering af lokale 4–31B sprogmodeller på dansk
- Lagdelt sikkerhedsplan og prioriteret roadmap for ekstern eksponering
