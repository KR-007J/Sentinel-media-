<div align="center">
  <img src="./public/logo.png" alt="Sentinel-Zero Logo" width="160" />
  <h1>🛡️ Sentinel-Zero — Enterprise AI Security Hub</h1>
  <p><strong>A deterministic, production-grade cybersecurity command center with advanced Role-Based Access Control (RBAC), AI-powered threat analysis, and real-time incident response simulation.</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
  [![Google Brand](https://img.shields.io/badge/Design-Google%20Developer%20Brand-1a73e8.svg)](https://developers.google.com/)
  [![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-1a73e8.svg)](https://deepmind.google/technologies/gemini/)
  [![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28.svg)](https://firebase.google.com/)
  [![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E.svg)](https://supabase.com/)
  [![RBAC](https://img.shields.io/badge/Security-RBAC%20Enforced-critical.svg)](#-deterministic-role-based-access-control-rbac)
</div>

---

## 🎯 Challenge Vertical: Cybersecurity & Digital Safety Assistant
**Sentinel-Zero** is built as a **Smart Digital Safety Assistant** for high-security environments. It moves beyond passive monitoring by using Gemini 1.5 Flash to provide explainable forensics, actionable mitigation steps, and context-aware security posture updates.

### 🧠 Logic & Decision Making
- **Deterministic RBAC**: The system evaluates user roles (ADMIN, ANALYST, VIEWER) at every state transition. 
- **AI-Powered HEURISTICS**: Instead of basic regex, the "Neural Core" (Gemini) analyzes threat vectors to understand Intent vs. Anomalous but safe behavior.
- **Explainable SIEM**: Every alert contains a logic trail from Gemini explaining *why* it was flagged, reducing cognitive load on security operators.

---

<hr />

## 📖 Executive Summary
**Sentinel-Zero** is a sophisticated, high-authority AI-OS engineered for enterprise-tier asset protection and threat intelligence. Moving beyond standard dashboards, it implements a **Deterministic Role-Based Access Control (RBAC)** system with cinematic state transitions, simulating a high-security operational environment. Powered by **Gemini 1.5 Flash** and a multi-layered cloud backbone, it provides sub-second detection and automated forensic compilation.

---

## 🛠️ Core Competencies & Tech Stack
- **Frontend Architecture:** React 18, Vite, Zustand (State Management), Framer Motion (Cinematic UI Transitions).
- **Security Logic:** Hardened RBAC state machine, Zero-Trust authentication flow, and interactive Simulation Mode.
- **Backend Infrastructure:** Firebase (Auth, Hosting), Supabase (Postgres Real-time DB), Gemini 1.5 Flash (AI Reasoning).
- **Design System:** Strict adherence to **Google Developer Brand Palette** for technical authority and cognitive clarity.

---

## 🔐 Deterministic Role-Based Access Control (RBAC)
The system enforces strict permission headers across all modules, featuring secure atomic transitions and persistent mode indicators.

| Role | Access Level | Visual Indicator | Permissions |
|:---:|:---:|:---:|---|
| **ADMIN** | High | `RED (Critical Color)` | Full system override, Lockdown mode, Threat resolution, Simulation control. |
| **ANALYST** | Medium | `BLUE (Standard Color)` | Neural scanning, Risk assessment, Telemetry review, Feed monitoring. |
| **VIEWER** | Low | `GREY (Restricted Color)` | Read-only access to global metrics. All tactical actions are disabled with tooltips. |

---

## 🏗️ Technical Features

### 1. 🧬 Content DNA & AI Forensics
- **Explainable Forensics:** Every threat detection includes a multimodal AI reasoning trail provided by Gemini.
- **Explainable SIEM Logs:** Every event is logged using structured cybersecurity formats `[SUBSYSTEM] ACTION | src:IP → tgt:Path | status:CODE`.

### 2. 🎮 Interactive Adversarial Simulations
- **Attack Profiles:** Real-time simulation of XSS Payloads, SQL Injection vectors, and Distributed Bot Scraping.
- **Deterministic Response:** Defenses like `Strategic Firewall` or `2FA Enforcement` actively filter incoming threat feeds.

### 3. 🚨 System Lockdown Mode
- **Mic-Drop Security:** A coordinated system-wide event that terminates active threats, secures the network perimeter, and forces a secure baseline state.

---

## 📁 Repository Structure
```bash
src/
├── components/   # Modular UI components (Sidebar, Dashboard Units)
├── hooks/        # Hardened Zustand store (RBAC & Logic Core)
├── pages/        # High-authority views (Dashboard, Scanner, Login)
├── services/     # API Integration (Gemini, Supabase, Firebase)
└── index.css     # Enterprise Design System (Google Tokens)
```

---

## ⚙️ Setup & Deployment

1. **Clone & Install**
   ```bash
   git clone https://github.com/KR-007J/Sentinel-Zero.git
   npm install
   ```

2. **Environment Configuration**
   ```env
   VITE_GEMINI_API_KEY=your_key
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🏆 Industrial Differentiators
- 📡 **Zero-Latency Monitoring:** Real-time Supabase snapshot listeners for instant threat propagation.
- 🎨 **Enterprise Aesthetic:** High-legibility Google Brand design optimized for professional security operations.
- ⚖️ **Audit-Ready:** Maintains detailed operator activity logs and AI-anchored evidence dossiers.

---

## 🧪 Testing & Quality Assurance
Sentinel-Zero prioritizes reliability through a comprehensive testing suite:
- **Unit Testing:** Powered by `Vitest`. Focuses on the core `SentinelEngine` risk calculation and RBAC logic.
- **Coverage:** Ensures that all high-risk logic transitions (e.g., threat detection thresholds) are verified and reproducible.
- **Command:** `npm test`

## ♿ Accessibility Compliance
Engineered for inclusive security operations following WCAG 2.1 guidelines:
- **Semantic HTML & ARIA:** Comprehensive use of ARIA 1.1 landmarks, live regions, and labels (`role="status"`, `aria-live="polite"`).
- **Labeling:** All interactive elements, including AI copy buttons and scan triggers, feature clear descriptive labels for screen readers.
- **Visual Clarity:** High-contrast color palettes (following Google Developer standards) ensure readability for users with visual impairments.

---

<p align="center">
  <b>Developed by Krish Joshi</b><br />
  &copy; All Rights Reserved 2026
</p>
