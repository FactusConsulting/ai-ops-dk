---
title: "Vision-baseret kvalitetskontrol på produktionslinje"
summary: "Erstattede manuel slut-inspektion på en kompleks komponentproduktion med en AI-baseret vision-løsning der kører on-prem på fabrikken."
industry: "Industri"
duration: "6 måneder"
date: 2025-11-22
role: "AI-arkitekt og leverandørvalg"
technologies:
  - "Custom vision-model (PyTorch)"
  - "NVIDIA Jetson på edge"
  - "MLOps-pipeline (MLflow)"
  - "On-prem Kubernetes"
outcomes:
  - value: "73%"
    label: "færre defekter sluppet videre"
  - value: "1.4 sek"
    label: "inspektionstid pr. enhed"
  - value: "ROI < 9 mdr"
    label: "tilbagebetalingstid"
---

## Udgangspunktet

En dansk producent af elektromekaniske komponenter havde manuel slut-inspektion på en linje der producerer ~12.000 enheder pr. døgn. Defekter der slap igennem kostede dyrt — både i reklamationer og i nedsat tillid hos OEM-kunder. Tidligere forsøg med en standard-leverandør var løbet ud i sandet pga. for høj falsk-positiv-rate.

## Tilgangen

Vi tog et bevidst valg om at bygge en custom-model frem for at bruge en off-the-shelf platform — netop fordi defekt-typerne var meget specifikke. Forløbet:

- **Datafundament først.** 6 ugers struktureret indsamling og labeling af defekt-eksempler sammen med produktionsteknikere
- **Iterativ modeludvikling.** Tre runder med produktionstest hvor falske positive blev målet at minimere
- **Edge-deployment.** Inferens kører på NVIDIA Jetson direkte på linjen — ingen netværksafhængighed, ingen cloud-kost
- **Drift som operatørerne ejer.** MLOps-pipeline der lader produktionsteknikere selv genoptræne modellen når nye defekt-typer dukker op

## Resultatet

Defekter der slipper videre til kunde er faldet 73%. Linje-hastigheden er øget en smule fordi den manuelle station er flyttet til stikprøvekontrol. Kunden kan selv vedligeholde og forbedre modellen — jeg deltager kun ved kvartalsvis review.

## Hvad jeg leverede

- Use case-kvalificering og leverandør-vurdering
- Arkitektur for edge-deployment og MLOps-pipeline
- Hands-on udvikling af model og inferens-stack
- Oplæring af internt produktions-IT team
