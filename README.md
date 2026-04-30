# ThumaDx
> AI-powered clinical decision support for Community Health Volunteers in rural West Africa

ThumaDx puts diagnostic intelligence at the point of care — in the hands of 
Community Health Volunteers (CHVs) operating in low-resource, low-connectivity 
environments where a child can die within 24 hours of a first symptom.

## What it does

CHVs describe symptoms in plain language. ThumaDx triages for acute malaria and 
pneumonia, detects severe acute malnutrition from MUAC tape images, and fires 
real-time outbreak alerts to district health officials — all from a single submission.

## Stack

| Layer | Technology |
|---|---|
| Diagnostic intelligence | Gemini via Google AI Studio |
| Computer vision | Google Vision API / Vertex AI |
| Database & sync | Firebase Firestore |
| Outbreak mapping | Leaflet.js / GIS |
| Frontend (MVP) | Streamlit |

## Key features

- WHO age-specific triage thresholds for malaria and pneumonia
- MUAC image analysis for severe acute malnutrition detection
- Structured JSON output powering a live GIS district dashboard
- Automatic outbreak alerts when 3+ cases cluster in a zone within 72 hours
- Offline-first case queue with background sync on reconnection
- Plain-language CHV instructions, including local Pidgin support

## Status

MVP prototype — system prompt live in Google AI Studio. Streamlit frontend 
and Firebase integration in progress.

---

> **Disclaimer:** ThumaDx is a decision support tool only. Final clinical 
> decisions must be made by a qualified health professional or district health officer.

View your app in AI Studio: https://ai.studio/apps/ed17e072-684d-489d-bf5e-df06acd5bba8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
