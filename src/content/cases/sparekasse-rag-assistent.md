---
title: "Intern videns-assistent baseret på 12 års rådgivning"
summary: "Hjalp en regional sparekasse med at gøre 200.000+ siders intern dokumentation tilgængelig som en sikker AI-assistent for kunderådgivere."
industry: "Finans"
duration: "4 måneder"
date: 2026-02-10
role: "Teknisk lead og arkitekt"
technologies:
  - "Self-hosted LLMs (Llama 3.3 70B)"
  - "vLLM"
  - "Weaviate"
  - "RAG-pipeline"
  - "Azure (privat tenant)"
outcomes:
  - value: "8 min → 40 sek"
    label: "tid pr. produktforespørgsel"
  - value: "94%"
    label: "rådgivere bruger det dagligt"
  - value: "0 kr."
    label: "data forlader EU"
---

## Udgangspunktet

Sparekassens kunderådgivere brugte i gennemsnit 8 minutter pr. forespørgsel på at finde det rette produktnotat, vilkår eller præcedens i en blanding af SharePoint, fildrev og en aldrende DMS-løsning. Compliance forhindrede brug af eksterne AI-tjenester, og tidligere forsøg med interne søgemaskiner havde ikke flyttet noget.

## Tilgangen

Vi byggede en RAG-baseret assistent der kører fuldt ud inden for sparekassens egen Azure-tenant — ingen data forlader nogensinde EU eller en ekstern leverandør. Kerneelementerne var:

- **Self-hosted LLM** (Llama 3.3 70B på vLLM) for fuld kontrol over data og kost
- **Hybrid retrieval** der kombinerer keyword- og vektor-søgning for høj præcision på finansielle termer
- **Adgangsstyring pr. dokument** der respekterer eksisterende rettigheder fra Active Directory
- **Audit log** af hver forespørgsel og hvert returneret kildedokument

## Resultatet

Efter 4 måneder i drift bruger 94% af kunderådgiverne assistenten dagligt. Tidsforbruget pr. produktforespørgsel er faldet fra ca. 8 minutter til under 1 minut, og — vigtigere — kvaliteten af svarene er målt højere end manuelt opslag i blindtest med 50 cases.

> "Det er den første teknologi-investering på 5 år hvor jeg får direkte feedback fra rådgiverne om at det letter deres hverdag."
> — IT-direktør

## Hvad jeg leverede

- Arkitekturdesign og leverandøruafhængig vurdering
- Implementering af RAG-pipeline og evaluerings-framework
- Onboarding og oplæring af internt team til drift
- Governance- og compliance-dokumentation
