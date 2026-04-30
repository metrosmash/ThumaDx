<div align="center">

```
████████╗██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██║  ██║██║   ██║████╗ ████║██╔══██╗██╔══██╗╚██╗██╔╝
   ██║   ███████║██║   ██║██╔████╔██║███████║██║  ██║ ╚███╔╝
   ██║   ██╔══██║██║   ██║██║╚██╔╝██║██╔══██║██║  ██║ ██╔██╗
   ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝
```

### Intelligent Frontline Diagnostics for Rural West Africa

*Triage. Detect. Alert. Before it's too late.*

---

![Status](https://img.shields.io/badge/status-MVP%20prototype-brightgreen)
![Stack](https://img.shields.io/badge/AI-Gemini%20%7C%20Vision%20API-blue)
![Backend](https://img.shields.io/badge/backend-Firebase-orange)
![Mapping](https://img.shields.io/badge/mapping-Leaflet.js%20%2F%20GIS-green)
![Platform](https://img.shields.io/badge/frontend-Streamlit-red)
![Sector](https://img.shields.io/badge/sector-Global%20Health%20%2F%20GovTech-purple)
![Disclaimer](https://img.shields.io/badge/note-Decision%20Support%20Only-lightgrey)

</div>

---

## The Problem

In rural West Africa, a child with acute **malaria** or **pneumonia** can die within **24 hours** of their first symptom. Community Health Volunteers (CHVs) — the only medical touchpoint for millions of people — rely on manual observation, paper forms, and slow reporting chains.

By the time data reaches a district supervisor, the window to intervene has often already closed.

**ThumaDx changes that.**

---

## What ThumaDx Does

ThumaDx is a multi-modal clinical decision support platform that puts the diagnostic intelligence of a district hospital into the hands of a CHV in the field.

A CHV describes symptoms in plain language or local Pidgin. ThumaDx converts that into a structured triage assessment — in real time, at the point of care — and simultaneously updates a live outbreak map visible to district officials.

```
CHV speaks or types symptoms
        │
        ▼
┌───────────────────────┐
│   ThumaDx Engine      │  ← Gemini NLP + WHO clinical thresholds
│   Symptom Analysis    │
└───────────┬───────────┘
            │
     ┌──────┴──────┐
     ▼             ▼
┌─────────┐  ┌──────────────┐
│ MUAC    │  │ Triage       │  MONITOR / HIGH RISK /
│ Image   │  │ Classification│  URGENT REFERRAL / CRITICAL
│ Vision  │  └──────┬───────┘
│ API     │         │
└────┬────┘         │
     └──────┬───────┘
            ▼
┌───────────────────────┐
│  Firebase Firestore   │  → GIS Dashboard → Outbreak Alerts
└───────────────────────┘
```

---

## Core Capabilities

### 🩺 Precision Triage — Powered by Gemini

CHVs describe what they observe in natural language. ThumaDx:

- Applies **WHO age-specific respiratory thresholds** (infant, toddler, child)
- Identifies **Red Flag indicators** for acute malaria and pneumonia
- Accounts for **comorbidities** — sickle cell, HIV exposure, low birth weight
- Returns a plain-language instruction the CHV can act on immediately, without medical training

**Triage levels:**

| Level | Meaning |
|---|---|
| 🟢 `MONITOR` | Mild or single symptom — observe and follow up |
| 🟡 `HIGH RISK` | Multiple symptoms, no immediate red flags |
| 🔴 `URGENT REFERRAL` | Red flag present — refer to clinic now |
| ⚫ `CRITICAL` | Red flag + severe malnutrition or comorbidity — emergency |

---

### 👁️ Visual Malnutrition Detection — Powered by Google Vision API

A photo of a child's **MUAC tape** is all it takes. ThumaDx:

- Classifies nutritional status: **Green / Yellow / Red (Severe Acute Malnutrition)**
- Feeds the result directly into the triage engine
- Automatically escalates to `CRITICAL` when severe malnutrition coincides with infection — because that combination kills fastest

> No manual measurement recording. No human classification error.

---

### 🗺️ Geospatial Outbreak Intelligence — Powered by Firebase + Leaflet.js

Every case logged by a CHV becomes a live data point on the district map.

- **Outbreak trigger:** When 3+ cases of the same illness cluster in the same geographic zone within 72 hours, ThumaDx fires an automatic `Red Alert` to district supervisors
- **Proactive deployment:** Officials move from reactive reporting to dispatching response teams before a situation becomes a crisis
- **Ministry dashboard:** Anonymized, aggregated case data gives the Ministry of Health a high-resolution view of rural disease burden by district, season, and demographic — for the first time

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ThumaDx MVP                          │
├──────────────┬──────────────────┬───────────────────────────┤
│   Frontend   │   AI Engine      │   Data & Infrastructure   │
│              │                  │                           │
│  Streamlit   │  Gemini (via     │  Firebase Firestore       │
│  (MVP)       │  Google AI       │  (case storage + sync)    │
│              │  Studio)         │                           │
│  Flutter     │                  │  Leaflet.js / GIS         │
│  (roadmap)   │  Vision API /    │  (district heatmap)       │
│              │  Vertex AI       │                           │
│              │  (MUAC image     │  Offline queue            │
│              │  analysis)       │  (local → sync on 4G)     │
└──────────────┴──────────────────┴───────────────────────────┘
```

| Layer | Technology | Function |
|---|---|---|
| Diagnostic intelligence | Gemini via Google AI Studio | NLP symptom triage |
| Computer vision | Google Vision API / Vertex AI | MUAC image classification |
| Database & sync | Firebase Firestore | Real-time case storage + outbreak triggers |
| Outbreak mapping | Leaflet.js / GIS | District-level heatmap |
| Frontend (MVP) | Streamlit | CHV input + results dashboard |
| Frontend (scale) | Flutter | Mobile-first, offline-capable |

---

## Structured Output

Every ThumaDx assessment produces a structured JSON block that feeds directly into Firebase and the GIS dashboard:

```json
{
  "risk_score": 9,
  "disease_flag": "Multiple",
  "alert_level": "Red",
  "outbreak_flag": false,
  "confidence": 0.94,
  "comorbidity_flags": ["sickle_cell"],
  "chv_action": "Take this child to the hospital immediately. Do not wait.",
  "summary_for_official": "10-month-old female, critical — pneumonia + SAM + sickle cell trait, Kano district."
}
```

---

## Built for the Field

ThumaDx is designed around the realities of rural infrastructure, not ideal conditions.

**Offline-first:** Cases queue locally on the CHV's device and sync automatically the moment connectivity is restored. No case is ever lost in the field.

**Edge AI roadmap:** Future versions will run vision inference on-device via **TensorFlow Lite** — no internet required for malnutrition detection.

**Language-aware:** `chv_action` outputs in plain English or local Pidgin depending on how the CHV communicated. District official summaries always remain in formal English.

**Auditable:** Every triage decision includes a `confidence` score and step-by-step clinical reasoning for supervisor review.

---

## System Prompt

ThumaDx runs on a structured system instruction prompt deployed in Google AI Studio.

**Key parameters:**

```
Model       : Gemini 1.5 Pro
Temperature : 0.1  (deterministic clinical output)
Max tokens  : 2048
```

The prompt encodes:
- WHO fast-breathing thresholds by age group
- Red Flag escalation protocol
- Multi-modal Vision API integration rules
- Outbreak clustering logic (3 cases / 72hr / zone → Red Alert)
- Mandatory JSON output schema
- Confidence scoring and supervisor review triggers

> See [`ThumaDx_System_Prompt.md`](./ThumaDx_System_Prompt.md) for the full system instruction.

---

## Validation Test Case

Paste this into AI Studio to verify the system is working correctly:

```
"Patient is a 10-month-old girl in Kano district. High fever for 3 days,
coughing, chest pulling when breathing. Mother says she has sickle cell trait.
Breathing rate: 55 breaths/min. Vision API: MUAC 10.8cm — Severe Acute Malnutrition."
```

**Expected output:**

```json
{
  "risk_score": 10,
  "disease_flag": "Multiple",
  "alert_level": "Red",
  "outbreak_flag": false,
  "confidence": 0.94,
  "comorbidity_flags": ["sickle_cell"],
  "chv_action": "Take this child to the hospital immediately. Do not wait.",
  "summary_for_official": "10-month-old female, critical presentation — pneumonia + SAM + sickle cell, Kano district."
}
```

---

## Project Status

| Component | Status |
|---|---|
| System prompt (AI Studio) | ✅ Complete |
| Triage logic + JSON schema | ✅ Complete |
| MUAC Vision API integration | 🔄 In progress |
| Streamlit frontend | 🔄 In progress |
| Firebase Firestore setup | 🔄 In progress |
| Leaflet.js GIS dashboard | 📋 Planned |
| Offline queue (local sync) | 📋 Planned |
| Flutter mobile app | 📋 Roadmap |
| Edge inference (TFLite) | 📋 Roadmap |

---

## Investor Summary

| | |
|---|---|
| **Sector** | Global Health / GovTech / AI Infrastructure |
| **Primary users** | Community Health Volunteers, District Health Officers, Ministries of Health |
| **Market** | Sub-Saharan Africa — 1M+ active CHVs across the continent |
| **Unique value** | The only integrated tool combining individual point-of-care diagnostics with district-level outbreak surveillance, built for low-resource, low-connectivity environments |
| **Tech stack** | Gemini · Vision API · Firebase · Leaflet.js |
| **Stage** | MVP — Google AI Studio prototype |

---

## Contributing

This is an open MVP. Contributions welcome — especially from health informatics, mobile development (Flutter), and GIS/mapping backgrounds.

Please open an issue before submitting a pull request.

---

## Disclaimer

> **ThumaDx is a clinical decision support tool only.**
> It does not replace a qualified medical professional or district health officer.
> Final clinical decisions must always be made by a licensed health professional.
> All patient data must be handled in compliance with applicable national health data regulations.

---

<div align="center">

*ThumaDx — Decision support for those who cannot wait.*

**Built for the 2026 AI for Health Challenge**

</div>
