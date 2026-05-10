---
title: "Privat GPU-platform til AI-arbejde i offentlig styrelse"
summary: "Etablerede GPU-infrastruktur under egen kontrol så en styrelse kan arbejde seriøst med store sprogmodeller — også på data der potentielt indeholder personfølsomme oplysninger."
industry: "Offentlig sektor"
duration: "Igangværende"
date: 2026-03-15
role: "Infrastruktur-arkitekt og rådgiver"
technologies:
  - "Hetzner dedikerede GPU-servere"
  - "NVIDIA RTX PRO 6000 Blackwell (96 GB)"
  - "CUDA / NVIDIA driver-stack"
  - "Linux"
  - "Kubernetes (integration)"
outcomes:
  - value: "3 noder"
    label: "GPU-kapacitet etableret"
  - value: "96 GB"
    label: "VRAM pr. kort"
  - value: "0"
    label: "tredjeparter med adgang"
---

## Udgangspunktet

En dansk styrelse skulle have kapacitet til at arbejde seriøst med AI — herunder at eksperimentere med store, åbne sprogmodeller på data der potentielt indeholder personfølsomme og henførbare oplysninger. Det udelukkede de fleste cloud-baserede GPU-tjenester: data og inferens skulle blive på infrastruktur som styrelsen selv kontrollerer, både juridisk og operationelt.

Samtidig var traditionel on-prem GPU-investering — racks i eget datacenter — både kapitaltung og langsom at få op at stå. Der var brug for noget midt imellem: dedikeret hardware under egen kontrol, men uden den lange anskaffelses- og driftsforpligtelse.

## Tilgangen

Jeg etablerede platformen på dedikerede GPU-servere hos Hetzner. Det giver fysisk hardware, kontraktligt isoleret, EU-placeret — men med kort lead time og forudsigelig månedlig pris frem for stort engangsindkøb.

Konkret kom det til at omfatte:

- **3 dedikerede GPU-noder** udstyret med NVIDIA RTX PRO 6000 Blackwell (96 GB VRAM pr. kort). Det giver plads til at køre store open-weights modeller i fuld præcision på en enkelt node og fine-tune mellemstore modeller uden multi-node-opsætning
- **NVIDIA-stack** — drivere, CUDA, container-runtime — installeret og verificeret pr. node, klar til arbejdsbelastning
- **Forberedelse til deling** så noderne kunne integreres i et Kubernetes-cluster og stilles til rådighed for udviklere på tværs af teams. Selve cluster-laget blev efterfølgende bygget af et internt team — min rolle var den underliggende infrastruktur og at sikre at GPU-noderne kunne integreres rent

## Status og næste skridt

Platformen er etableret og udviklere har adgang. Næste fase — som er i gang — er struktureret evaluering af forskellige små og mellemstore open-weights modeller for at finde den rette balance mellem kvalitet, latency og GPU-forbrug for styrelsens konkrete use cases.

Pointen er ikke at have den nyeste GPU. Pointen er at have *kontrolleret* kapacitet, så styrelsen kan eksperimentere og bygge løsninger uden at hver beslutning skal igennem en compliance-vurdering af endnu en ekstern tjeneste.

## Hvad jeg leverede

- Vurdering og valg af GPU-leverandør og hardware-konfiguration
- Opsætning af CUDA og NVIDIA-stack på dedikerede noder
- Igangværende evaluering af lokale open-weights modeller
