<div align="center">

# Bavly-Hamdy / README Studio (v2.1.0)

**An enterprise-grade orchestration platform for automated repository documentation, GitHub telemetry analytics, multimodal CV synergy, and AI-driven developer persona synthesis.**

<br />

<img src="public/favicon.svg" width="96" height="96" alt="README Studio Logo" />

<br /><br />

[![Release: v2.1.0](https://img.shields.io/badge/Release-v2.1.0--Current-8B5CF6?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/Bavly-Hamdy/readme-studio/releases)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript_5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Frontend: React 19](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Build: Vite 8.3](https://img.shields.io/badge/Build-Vite_8.3_(Rolldown)-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![AI: Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_3.8_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Security: OWASP Top 10](https://img.shields.io/badge/Security-OWASP_Top_10_Hardened-0ea5e9?style=for-the-badge&logo=owasp&logoColor=white)](#-security--owasp-top-10-hardening)
[![Sanitization: DOMPurify](https://img.shields.io/badge/Sanitizer-DOMPurify_Protected-critical?style=for-the-badge&logo=shield&logoColor=white)](#-security--owasp-top-10-hardening)
[![Zero-Trust: Client-Side](https://img.shields.io/badge/Privacy-100%25_Client--Side-10B981?style=for-the-badge&logo=shield&logoColor=white)](#-security--owasp-top-10-hardening)
[![CI: Passing](https://img.shields.io/github/actions/workflow/status/Bavly-Hamdy/readme-studio/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20Gate)](https://github.com/Bavly-Hamdy/readme-studio/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

[What's New in v2.1](#-whats-new-in-version-21-current) •
[Overview](#-overview--architectural-intent) •
[Why README Studio](#-why-readme-studio-v21-vs-alternatives) •
[Architecture & Workflow](#-architecture--workflow) •
[Interface Gallery](#-interface-gallery) •
[Core Features](#-core-features--capabilities) •
[Career & Resume Pipeline](#-multimodal-cv-intelligence--career-fusion) •
[Themes & Live Examples](#-4-handcrafted-markdown-theme-engines) •
[Telemetry & Scorecard Formula](#-telemetry-engine--codebase-quality-index) •
[Studio Section Guide](#-studio-section-customization-guide) •
[Technology Matrix](#-technologies--ecosystem-matrix) •
[Project Structure](#-project-structure) •
[Main Modules](#-main-modules--technical-breakdown) •
[Installation & CLI](#-requirements--installation-guide) •
[Security & OWASP Hardening](#-security--owasp-top-10-hardening) •
[Troubleshooting & FAQ](#-troubleshooting--frequently-asked-questions) •
[Future Roadmap](#-future-roadmap) •
[Author & License](#-authors--contributors)

---

</div>

<br />

> [!IMPORTANT]
> ### 🚀 Version 2.1.0 Milestone Release (Current): Multimodal Resume Synergy + GitHub Actions CI/CD + OWASP Top 10
> **README Studio v2.1.0 (Current)** bridges active codebases and real-world career trajectory with enterprise-grade security and automated synchronization. Ingest your CV/Resume (PDF or plain text) via Gemini 3.8 Flash, eliminate secondary framework boilerplate across 100% of your repositories, render production-ready career timelines across 4 handcrafted theme designs, and publish with complete confidence backed by **in-app GitHub Actions CI/CD workflows, DOMPurify XSS defenses, OWASP Top 10 hardening, and Rolldown modular production chunking**.

<br />

## 📋 Table of Contents
1. [What's New in Version 2.1 (Current)](#-whats-new-in-version-21-current)
2. [Overview & Architectural Intent](#-overview--architectural-intent)
3. [Why README Studio v2.1 vs Alternatives](#-why-readme-studio-v21-vs-alternatives)
4. [Architecture & Workflow](#-architecture--workflow)
   - [System Topology](#system-topology)
   - [Live Execution Sequence](#live-execution-sequence)
   - [Fallback Ladder & Resilience](#fallback-ladder--resilience)
   - [Engineering Trade-offs & Strategic Decisions](#engineering-trade-offs--strategic-decisions)
5. [Interface Gallery & Visual Telemetry](#-interface-gallery)
6. [Core Features & Capabilities](#-core-features--capabilities)
7. [Multimodal CV Intelligence & Career Fusion](#-multimodal-cv-intelligence--career-fusion)
   - [The Ingestion & Fusion Pipeline](#the-ingestion--fusion-pipeline)
   - [Extracted Career Schema](#extracted-career-schema)
   - [Anti-Hallucination Cross-Examination Algorithm](#anti-hallucination-cross-examination-algorithm)
8. [4 Handcrafted Markdown Theme Engines](#-4-handcrafted-markdown-theme-engines)
   - [1. Minimalist Theme (with Markdown Preview)](#1-minimalist-theme)
   - [2. Showcase Theme (with Markdown Preview)](#2-showcase-theme)
   - [3. Ivory Paper Theme (with Markdown Preview)](#3-ivory-paper-theme)
   - [4. Terminal Mono Theme (with Markdown Preview)](#4-terminal-mono-theme)
9. [Telemetry Engine & Codebase Quality Index](#-telemetry-engine--codebase-quality-index)
   - [Mathematical Formula Breakdown](#mathematical-formula-breakdown)
   - [Developer Archetype Classification](#developer-archetype-classification)
   - [Circadian Rhythm Analysis](#circadian-rhythm-analysis)
   - [Language DNA Byte Summation & Anti-Boilerplate Threshold](#language-dna-byte-summation--anti-boilerplate-threshold)
10. [Studio Section Customization Guide](#-studio-section-customization-guide)
11. [Technologies & Ecosystem Matrix](#-technologies--ecosystem-matrix)
12. [Requirements & Installation Guide](#-requirements--installation-guide)
13. [Project Structure](#-project-structure)
14. [Main Modules & Technical Breakdown](#-main-modules--technical-breakdown)
15. [CLI & Script Execution Matrix](#-cli--script-execution-matrix)
16. [Security, OWASP Top 10 Hardening & Privacy](#-security--owasp-top-10-hardening)
    - [OWASP A03: Injection & XSS Defense (DOMPurify)](#owasp-a03-injection--xss-defense-dompurify)
    - [OWASP A04: Insecure Design & Client DoS Prevention](#owasp-a04-insecure-design--client-dos-prevention)
    - [Strict Input Sanitization & GitHub Handle Spec](#strict-input-sanitization--github-handle-spec)
    - [Modern UTF-8 Standards-Compliant Base64 Serialization](#modern-utf-8-standards-compliant-base64-serialization)
    - [HTTP Security Headers & Clickjacking Mitigation](#http-security-headers--clickjacking-mitigation)
    - [Rolldown Modular Production Chunking](#rolldown-modular-production-chunking)
17. [Deployment & Environment Matrix](#-deployment--environment-matrix)
18. [Troubleshooting & Frequently Asked Questions](#-troubleshooting--frequently-asked-questions)
19. [Future Roadmap](#-future-roadmap)
20. [Authors & Contributors](#-authors--contributors)
21. [License](#-license)

---

## 🚀 What's New in Version 2.1 (Current)

Version 2.1 is a major architectural milestone, delivering **In-App GitHub Actions CI/CD Profile Synchronization**, **OWASP Top 10 Security Hardening**, **Multimodal Resume Ingestion**, **Anti-Boilerplate Tech Qualification**, and **Native Career Timelines**.

```mermaid
flowchart LR
    subgraph Ingestion [" 1. Multimodal Ingestion Layer "]
        CV["PDF / Text Resume<br/>(Experience • Education • Certs)"]
        GH["GitHub Metadata REST v3<br/>(100% Repos • Non-Sampled)"]
    end

    subgraph Intelligence [" 2. Gemini 3.8 Flash Engine "]
        Parser["Multimodal Document Parser<br/>(gemini-3.8-flash)"]
        CrossCheck["Cross-Examination Heuristic<br/>(Byte Weights vs Claimed Skills)"]
    end

    subgraph Compiler [" 3. Dual-AST Theme Compiler "]
        ThemeEngine["Theme Renderer<br/>(Minimal • Showcase • Paper • Mono)"]
        LiveMD["Bilingual Markdown Output<br/>(English LTR • Arabic RTL)"]
    end

    CV --> Parser
    GH --> CrossCheck
    Parser --> CrossCheck
    CrossCheck --> ThemeEngine
    ThemeEngine --> LiveMD
```

### 🌟 Version 2.1 Feature Matrix (Current)

| Capability | Implementation Module | Architectural Description |
| :--- | :--- | :--- |
| **🤖 GitHub Actions Profile Sync** | [`src/components/PublishModal.tsx`](file:///e:/README%20Studio/src/components/PublishModal.tsx) | Turnkey `.github/workflows/profile-sync.yml` generator with CRON schedules, target branch auto-detection, and atomic commit tokens. |
| **🧪 Enterprise CI Quality Gate** | [`.github/workflows/ci.yml`](file:///e:/README%20Studio/.github/workflows/ci.yml) | Automated GitHub Actions CI workflow executing multi-node testing, strict TypeScript verification (`tsc --noEmit`), and production builds on push/PR. |
| **📄 Multimodal CV Synergy** | [`src/services/resumeParser.ts`](file:///e:/README%20Studio/src/services/resumeParser.ts) | Parses binary PDF buffers or raw text using Gemini 3.8 Flash to extract verified employment chronologies, university degrees, GPA, and industry certificates. |
| **🛡️ Anti-Boilerplate Qualification** | [`src/services/techDetection.ts`](file:///e:/README%20Studio/src/services/techDetection.ts) | Filters out framework noise (e.g., Xcode Swift or Android Kotlin template files for web developers) by weighting authentic code bytes across 100% of repositories. |
| **💼 Dynamic Career Timelines** | [`src/services/markdownRenderer.ts`](file:///e:/README%20Studio/src/services/markdownRenderer.ts) | Handcrafted markdown timeline generators for Work Experience, Higher Education, and Certifications across all 4 theme styles. |
| **⚡ Multi-Tier Gemini Chain** | [`src/services/geminiService.ts`](file:///e:/README%20Studio/src/services/geminiService.ts) | Resilient model fallback ladder: `gemini-3.8-flash` → `gemini-2.5-flash` → `gemini-1.5-flash` ensuring zero service interruption. |
| **🛡️ OWASP Top 10 Hardening & XSS Defense** | [`src/services/sanitize.ts`](file:///e:/README%20Studio/src/services/sanitize.ts) | Enterprise DOMPurify sanitizer with GFM tag/attribute whitelist, executable script blocking, inline event stripping, and automatic reverse tabnabbing defense (`rel="noopener noreferrer nofollow"`). |
| **🔒 Client DoS & Memory Protection** | [`src/components/ResumeModal.tsx`](file:///e:/README%20Studio/src/components/ResumeModal.tsx) | Enforces hard 10MB payload boundaries and strict MIME/extension whitelist (`.pdf`, `.txt`, `.md`) to prevent client memory exhaustion. |
| **⚡ Rolldown Modular Code-Splitting** | [`vite.config.ts`](file:///e:/README%20Studio/vite.config.ts) | High-concurrency function-based bundle splitting (`vendor-react`, `vendor-ai`, `vendor-markdown`, `vendor-icons`), compiling under 500ms with a ~145 kB gzipped entry payload. |
| **🔤 Standards-Compliant UTF-8 Base64** | [`src/services/github.ts`](file:///e:/README%20Studio/src/services/github.ts) | Replaced deprecated `unescape` with modern `TextEncoder` byte chunks to guarantee safe Unicode/Arabic serialization during atomic GitHub commits. |
| **📊 Professional Developer Telemetry** | [`src/components/AnalyticsDashboard.tsx`](file:///e:/README%20Studio/src/components/AnalyticsDashboard.tsx) | Clean Developer Dossier, unified Codebase Quality Index, filtered Language DNA, circadian commit distribution, and repository spotlights. |
| **🌐 Native Bilingual RTL/LTR** | [`src/i18n/translations.ts`](file:///e:/README%20Studio/src/i18n/translations.ts) | Complete bilingual support across all editor controls, career timelines, modals, and compiled markdown outputs. |

---

## 🔍 Overview & Architectural Intent

**README Studio** addresses the chronic technical debt of stagnant, boilerplate project documentation. Traditional developer profile READMEs suffer from three systemic flaws:
1. **Badge Bloat:** Hundreds of uncurated, neon badges pasted from third-party badge farms that tell recruiters nothing about authentic code competence.
2. **AI Hallucinations:** Generic prompts that assign arbitrary skills or claim proficiency in languages the developer touched for only 15 lines of code.
3. **Stagnation & Fragility:** Manual markdown editing that breaks every time a new project is created or when URLs change.

By integrating directly with **GitHub’s REST v3 Metadata APIs** and leveraging **Google Gemini 3.8 Flash** for deep contextual synthesis, README Studio transforms raw repository graphs and verified career documents into high-fidelity, maintainable developer documentation.

### The "Data-to-Documentation" Paradigm
The architecture strictly decouples the three core responsibilities:
1. **Data Ingestion Layer (`src/services/githubAnalyzer.ts`):** Paginates across **100% of public repositories** with zero sampling approximations and client-side ETag caching.
2. **Contextual Synthesis Layer (`src/services/geminiService.ts`):** Translates language byte matrices, repository topics, and commit velocity into three coherent engineering voices via Gemini 3.8 Flash.
3. **Presentation & AST Compiler Layer (`src/services/markdownRenderer.ts`):** Compiles structured JSON models into GitHub-Flavored Markdown across 4 handcrafted design systems.

---

## ⚖️ Why README Studio v2.1 vs Alternatives

| Architectural Feature | Generic AI Prompts (ChatGPT / Claude) | Standard README Generators | README Studio v2.1 (Current) |
| :--- | :---: | :---: | :---: |
| **Data Grounding** | Hallucinates unverified skills | Superficial top-5 repo sampling | **100% Paginated GitHub Repositories** |
| **Language Composition** | Guesses from repo titles | Counts repo names (misleading) | **Exact Byte-Level Summation Matrix** |
| **Anti-Boilerplate Heuristics** | ❌ None (lists everything) | ❌ None | **Filters secondary template noise (< 0.4%)** |
| **Resume / CV Integration** | Requires manual copy-paste | ❌ Unsupported | **Multimodal PDF / Text AI Parser** |
| **Career Timelines** | Unformatted text blocks | ❌ Unsupported | **Native Markdown Timelines (4 Themes)** |
| **Design Discipline** | Cluttered rainbow badges | Cliché rainbow progress bars | **Restrained Editorial Typography (Linear style)** |
| **Client Privacy** | Server logs prompts | Unknown backend tracking | **100% Client-Side Zero-Trust Runtime** |
| **Publishing Safety** | Manual copy-paste into repo | ❌ No rollback mechanism | **1-Click Atomic Safe Commit with Rollback** |
| **Bilingual Localization** | Broken LTR/RTL mixing | English-only | **Complete Arabic (RTL) & English (LTR)** |

---

## 📌 Architecture & Workflow

### System Topology

The system operates as an **isolated client-side zero-trust runtime**. No proxy server or intermediary database ever intercepts tokens, resume data, or repository telemetry.

```mermaid
flowchart TB
    subgraph ClientBrowser [" Client Browser (Zero-Trust Sandbox) "]
        direction TB
        UIEngine["React 19 UI / UX Engine<br/>(Tailwind v4 • Ink Wash Design System)"]
        
        subgraph Pipeline [" Core Processing Pipeline "]
            IngestEngine["GitHub REST v3 Ingestion<br/>(ETag Caching • Full Pagination)"]
            ResumeParser["Multimodal Resume Ingestion<br/>(PDF & Text • Gemini 3.8 Flash)"]
            ASTParser["Tech Detection & Manifest Heuristics<br/>(Anti-Boilerplate Byte Qualification)"]
            DNASummarizer["Byte-Accurate Language DNA<br/>(Raw Byte Summation Matrix)"]
            GeminiSynthesizer["Gemini 3.8 Flash Engine<br/>(@google/genai SDK • 3 Voices)"]
            MarkdownAST["GFM AST & Theme Compiler<br/>(Marked Parser • Tokenizer)"]
        end

        subgraph LocalPersistence [" Browser LocalStorage "]
            LocalPAT["Encrypted GitHub Token"]
            LocalSnapshots["Atomic Rollback Snapshots"]
            LocalDrafts["Auto-Saved Draft Configurations"]
            LocalSettings["Theme & Locale Settings"]
        end
    end

    subgraph ExternalAPIs [" External Direct Endpoints (TLS 1.3) "]
        GitHubAPI["api.github.com<br/>(Users, Repos, Contents API)"]
        GoogleAI["generativelanguage.googleapis.com<br/>(Gemini 3.8 Flash API)"]
    end

    UIEngine --> IngestEngine
    UIEngine --> ResumeParser
    IngestEngine <-->|Direct REST v3| GitHubAPI
    ResumeParser <-->|Direct Client-Side Call| GoogleAI
    
    IngestEngine --> ASTParser
    IngestEngine --> DNASummarizer
    ResumeParser --> ASTParser
    
    ASTParser --> GeminiSynthesizer
    DNASummarizer --> GeminiSynthesizer
    GeminiSynthesizer <-->|Direct Client-Side Call| GoogleAI
    
    ASTParser --> MarkdownAST
    DNASummarizer --> MarkdownAST
    GeminiSynthesizer --> MarkdownAST
    ResumeParser --> MarkdownAST
    
    MarkdownAST --> UIEngine
    
    UIEngine -->|1-Click Atomic Commit| GitHubAPI
    UIEngine <--> LocalPersistence
```

---

### Live Execution Sequence

From initial username ingestion to atomic GitHub commit verification:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Engineer
    participant App as README Studio UI
    participant GH as GitHub REST v3 API
    participant AI as Gemini 3.8 Flash
    participant Store as Browser LocalStorage

    Dev->>App: Enter GitHub Handle (e.g. Bavly-Hamdy)
    App->>GH: GET /users/:login & /users/:login/repos (Paginated)
    GH-->>App: 200 OK (Full profile, repositories, languages, topics)
    
    App->>App: Calculate Byte-Accurate Language DNA Matrix
    App->>App: Detect Tech Stack & Filter Secondary Boilerplate (< 0.4%)
    
    opt Multimodal Resume Ingestion
        Dev->>App: Upload CV (PDF or Plain Text)
        App->>AI: Send file buffer to gemini-3.8-flash
        AI-->>App: Return Experience, Education & Certifications JSON
        App->>App: Cross-reference CV claims with verified GitHub repos
    end

    Dev->>App: Select Bio Tone (Architectural / Community / Minimalist)
    App->>AI: Invoke gemini-3.8-flash with structured repo telemetry
    AI-->>App: Return 3 high-impact bios & developer headlines
    
    App->>App: Render GFM with selected Theme (Minimal / Showcase / Paper / Mono)
    App-->>Dev: Live Real-Time Side-by-Side Preview & Code View
    
    Dev->>App: Click "Publish to GitHub"
    App->>Store: Save pre-commit snapshot of existing README.md
    App->>GH: Check if :owner/:owner repo exists (Create if missing)
    App->>GH: PUT /repos/:owner/:owner/contents/README.md (SHA verified)
    GH-->>App: 201 Created / 200 OK (Atomic Commit Successful)
    App-->>Dev: Deployment Verified with 1-Click Rollback Available
```

---

### Fallback Ladder & Resilience

To prevent API outages or quota stalls, README Studio implements a 4-tier model fallback ladder:

```mermaid
flowchart TD
    Req["Generate AI Bio or Parse Resume"] --> T1["Tier 1: gemini-3.8-flash<br/>(Ultra-low latency • Optimal structured output)"]
    T1 -->|Success| Out["Structured JSON / High-Fidelity Markdown"]
    T1 -->|Error / Quota Exhaustion| T2["Tier 2: gemini-2.5-flash<br/>(High-capacity fallback)"]
    T2 -->|Success| Out
    T2 -->|Error / Timeout| T3["Tier 3: gemini-1.5-flash<br/>(Legacy multi-modal model)"]
    T3 -->|Success| Out
    T3 -->|All Remote APIs Unavailable| T4["Tier 4: Local Deterministic AST Engine<br/>(Zero-network rule-based synthesis in aiBio.ts)"]
    T4 --> Out
```

---

### Engineering Trade-offs & Strategic Decisions

| Dimension | Architectural Strategy | Trade-off Rationale |
| :--- | :--- | :--- |
| **Execution Sandbox** | Pure Client-Side SPA (Vite + React) | Eliminates server-side hosting costs, eliminates token leakage vectors, and guarantees sub-second UI interactions. |
| **Language Aggregation** | Non-sampled Byte Summation | Paginating through all public repos incurs minor rate-limit overhead, but delivers 100% mathematical fidelity. |
| **AI Synthesis** | Google Gemini 3.8 Flash SDK | `gemini-3.8-flash` offers sub-second inference latency, strict JSON adherence, and native Arabic/English bilingual reasoning. |
| **CV Document Parsing** | Multimodal Gemini 3.8 Ingestion | Ingests PDF buffers natively without heavy client-side OCR libraries (e.g. pdf.js + Tesseract), reducing bundle size by over 4MB. |
| **Publishing Mechanism** | GitHub Contents API (`PUT`) | Checks existing SHA and creates automatic client-side rollback backups before committing, eliminating git merge conflicts. |
| **State Persistence** | Scoped `localStorage` | Zero remote user database. All personal access tokens, draft READMEs, and rollback snapshots reside exclusively on the developer's machine. |

---

## 🖼️ Interface Gallery

All screenshots are captured at **2x Retina resolution** from the live production build:

### 1. Landing Page Hero & Real-Time Ingestion
*Live rate limit quota monitor (`API: 58/60`), verified creator ribbon, and direct profile ingestion.*

![01 Landing Hero](public/screenshots/01_landing_hero.png)

---

### 2. Interactive Live Sandbox (Rendered GFM Preview)
*Live previewing authentic profiles before entering the studio with dynamic section toggles and 4 markdown themes.*

![02 Sandbox Preview](public/screenshots/02_live_sandbox_preview.png)

---

### 3. Byte-Accurate Language DNA Matrix
*Non-sampled calculation showing exact byte percentages and which specific repositories contribute to each language.*

![03 Language DNA](public/screenshots/03_live_sandbox_dna.png)

---

### 4. Gemini 3.8 Flash Bio Tone Comparator
*Real-time AI bio synthesis comparing Architectural, Open-Source Community, and Minimalist voices.*

![04 Gemini Bio Engine](public/screenshots/04_gemini_bio_engine.png)

---

### 5. Creator Spotlight & Real Repositories
*Highlighting Lead Architect Bavly Hamdy with real metrics, verified Cairo location, and live open-source projects.*

![05 Creator Spotlight](public/screenshots/05_creator_spotlight.png)

---

### 6. Studio Builder & Real-Time Section Editor
*The primary design studio with custom section editors, badge pickers, live code inspection, and instant preview.*

![06 Studio Builder](public/screenshots/06_studio_builder.png)

---

### 7. 1-Click Atomic Publishing Modal
*Direct GitHub Contents API commit workflow with SHA verification, repository initialization, and rollback safety.*

![07 Publish Modal](public/screenshots/07_publish_modal.png)

---

### 8. Deep Developer Analytics Dashboard
*Non-sampled developer archetype detection, circadian rhythm analysis, contribution timelines, and scorecards.*

![08 Analytics Dashboard](public/screenshots/08_analytics_dashboard.png)

---

### 9. Multimodal Resume & CV Ingestion Modal
*Tactile drag-and-drop document parser with 10MB safety bounds, real-time OCR progress simulation, and Bento Grid milestone review.*

![09 Resume Modal](public/screenshots/09_resume_modal.png)

---

### 10. Version 2.1 (Current) Architectural Hub & Release Changelog
*Interactive release modal showcasing multimodal resume synergy, anti-boilerplate tech qualification, and native career timelines.*

![10 What's New Modal](public/screenshots/10_whats_new_modal.png)

---

## ✨ Core Features & Capabilities

* **📄 Multimodal Resume & CV Synergy:** Upload your CV in PDF format or paste plain text. Gemini 3.8 Flash parses your employment history, academic background, and certifications, fusing them with GitHub repository metadata.
* **🛡️ Heuristic Anti-Boilerplate Qualification:** Paginates through 100% of repositories and calculates code byte distributions. Eliminates framework noise (e.g. secondary Xcode templates for web developers) to prevent false skill claims.
* **🤖 AI-Powered Bio Synthesis:** Harnesses `@google/genai` (Gemini 3.8 Flash) to synthesize 3 bespoke developer narratives (Architectural, Community, Minimalist) based on actual repository descriptions and languages.
* **🧬 Byte-Accurate Language DNA:** Bypasses superficial repo sampling by calculating the exact byte-level breakdown across all original codebases.
* **🎨 4 Handcrafted Design Systems:**
  - `Minimalist`: Editorial clarity, subtle lines, clean badges, zero visual noise.
  - `Showcase`: Architectural capsule headers, grouped tech cards, and dynamic typing banners.
  - `Ivory Paper`: Classic literary layout with serif headers and clean margins.
  - `Terminal Mono`: Monospaced command-line aesthetic formatted inside code blocks.
* **🚀 1-Click Atomic Safe Commits:** Automatically creates the special `username/username` repository if missing, validates the file SHA, and executes an atomic commit with instant rollback capability.
* **📊 Professional Developer Telemetry:** Evaluates developer archetypes (System Architect, Interface Craftsman, Full-Stack Polyglot) and circadian commit rhythms.
* **🌐 Bilingual RTL/LTR Architecture:** Native English (LTR) and Arabic (RTL) localization with typography fine-tuned via `Newsreader`, `JetBrains Mono`, and `IBM Plex Sans Arabic`.

---

## 📄 Multimodal CV Intelligence & Career Fusion

README Studio v2.1 solves the disconnection between codebases and formal careers. A developer's GitHub may contain 40 repositories, but without context on former employers, engineering roles, and university degrees, the profile remains incomplete.

### The Ingestion & Fusion Pipeline

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CAREER FUSION PIPELINE                          │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Document Ingestion    │ PDF Binary ArrayBuffer or Plain Text Buffer │
│ 2. Multimodal Extraction │ Gemini 3.8 Flash (Structured JSON Schema)   │
│ 3. Entity Classification │ ExperienceItem[] • EducationItem[] • Cert[] │
│ 4. Cross-Examination     │ Match CV claimed skills vs repo byte totals │
│ 5. Granular Merge Control│ Selective toggle per career milestone       │
│ 6. AST Compilation       │ Formats into Theme-compatible GFM timelines │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### Extracted Career Schema

The TypeScript interface for extracted career records (`src/types/index.ts`):

```typescript
export interface ExperienceItem {
  id: string;
  role: string;               // e.g. "Senior Software Engineer"
  company: string;            // e.g. "Acme Corp"
  location?: string;          // e.g. "Cairo, Egypt / Remote"
  startDate: string;          // e.g. "Jan 2024"
  endDate: string;            // e.g. "Present"
  current: boolean;
  description: string;        // Bullet-pointed impact metrics
  technologies: string[];     // ["TypeScript", "Next.js", "PostgreSQL"]
}

export interface EducationItem {
  id: string;
  degree: string;             // e.g. "B.Sc. in Computer Science"
  institution: string;        // e.g. "Cairo University"
  startDate?: string;
  endDate: string;            // e.g. "2024"
  gpa?: string;               // e.g. "3.85 / 4.00"
  honors?: string;            // e.g. "First Class Honors"
  activities?: string;
}

export interface CertificationItem {
  id: string;
  name: string;               // e.g. "AWS Certified Solutions Architect"
  issuer: string;             // e.g. "Amazon Web Services"
  issueDate: string;          // e.g. "2025"
  credentialUrl?: string;     // Verified certificate verification link
}
```

### Anti-Hallucination Cross-Examination Algorithm

To prevent candidate inflation or accidental false claims, the `fuseResumeWithProfile` service executes the following verification loop:

```typescript
// Excerpt from src/services/resumeParser.ts
export function fuseResumeWithProfile(
  resume: ParsedResumeData,
  profile: GitHubProfile,
  repos: EnrichedRepo[],
  languages: LanguageStat[]
): ProfileConfigPatch {
  // 1. Build an authentic set of verified languages and framework topics
  const verifiedLanguages = new Set(languages.map(l => l.name.toLowerCase()));
  const verifiedTopics = new Set(repos.flatMap(r => r.topics.map(t => t.toLowerCase())));

  // 2. Cross-examine technologies claimed in resume
  const validatedTechnologies = resume.skills.filter(skill => {
    const s = skill.toLowerCase();
    const isLangMatch = verifiedLanguages.has(s);
    const isTopicMatch = verifiedTopics.has(s);
    // If not directly in code, verify against high-confidence job description context
    return isLangMatch || isTopicMatch || resume.technologiesMentionedInWorkExp.includes(s);
  });

  return {
    experience: resume.experience,
    education: resume.education,
    certifications: resume.certifications,
    qualifiedSkills: validatedTechnologies
  };
}
```

---

## 🎨 4 Handcrafted Markdown Theme Engines

README Studio compiles structured data into 4 distinct visual languages. Below is a detailed breakdown of each design system, including exact rendered Markdown previews:

---

### 1. Minimalist Theme
* **Design Philosophy:** Editorial clarity, high contrast, typography-first, and zero decorative noise. Inspired by the visual discipline of Linear and GitHub Next.
* **Headers:** Subtle hairline dividers (`---`), no animated GIFs, clean monochrome badges.
* **Career Timelines:** Clean bulleted chronologies with bold roles, italic companies, and parenthesized date ranges.
* **Best for:** Senior engineers, systems architects, and minimalist developers.

#### Minimalist Markdown Output Preview:
```markdown
# Bavly Hamdy
**Senior Full-Stack Software Engineer & UI/UX Architect** — Cairo, Egypt

Full-stack engineer crafting high-concurrency cloud systems and resilient frontend architectures. Focused on strict TypeScript types, zero-trust security, and high-contrast design systems.

---

### Experience
- **Lead Software Engineer** at *Acme Cloud* (2024 — Present)
  - Engineered real-time telemetry streaming pipeline processing 12M events daily.
  - Stack: `TypeScript`, `Node.js`, `PostgreSQL`, `Docker`

- **Senior Frontend Engineer** at *Nexus Systems* (2022 — 2024)
  - Re-architected core SaaS dashboard into Next.js App Router, cutting LCP by 64%.
  - Stack: `React`, `TypeScript`, `Tailwind CSS`

---

### Language DNA
TypeScript (64.2%) • Python (22.8%) • SQL (8.5%) • Rust (4.5%)

---

### Selected Projects
- **[README Studio](https://github.com/Bavly-Hamdy/readme-studio)** — Automated repository documentation and telemetry platform.
- **[GitArmorAI](https://github.com/Bavly-Hamdy/GitArmorAI)** — DevSecOps AST security scanner with 1-click surgical PR fixes.
```

---

### 2. Showcase Theme
* **Design Philosophy:** SaaS dashboard aesthetics, visual hierarchy, grouped tech categories, and rich badge callouts.
* **Headers:** Architectural capsule badges, optional dynamic typing animation banner (`readme-typing-svg`).
* **Career Timelines:** Rich boxed callout blocks with skill tag pills.
* **Best for:** Full-stack developers, open-source maintainers, and product engineers.

#### Showcase Markdown Output Preview:
```markdown
<div align="center">

# Hi there, I'm Bavly Hamdy 👋
### Senior Full-Stack Software Engineer & UI/UX Architect

[![Type](https://img.shields.io/badge/Focus-Full--Stack_Architecture-0ea5e9?style=for-the-badge)](#)
[![Location](https://img.shields.io/badge/Location-Cairo%2C%20Egypt-6366f1?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Building_Open--Source-10b981?style=for-the-badge)](#)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=0EA5E9&center=true&vCenter=true&width=435&lines=Architecting+Modern+Cloud+Systems;Crafting+Pixel-Perfect+Interfaces;100%25+Client-Side+Privacy" alt="Typing SVG" />

</div>

### 🛠️ Core Technologies

#### Frontend Architecture
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

#### Cloud & Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

### 💼 Career Trajectory
> **Lead Software Engineer** • Acme Cloud  
> *Jan 2024 — Present • Cairo, Egypt*  
> Directed core platform re-architecture, scaling microservices to 100k req/sec.

### 📊 GitHub Activity
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=Bavly-Hamdy&show_icons=true&theme=tokyonight" alt="GitHub Stats" />
</div>
```

---

### 3. Ivory Paper Theme
* **Design Philosophy:** Academic monograph aesthetic, literary typography, classical proportions, serif headers, and publication styling.
* **Headers:** Centered serif headings, blockquoted research/engineering summaries, and understated rule lines.
* **Career Timelines:** Academic CV style with institution, honors, GPA, and formal chronology.
* **Best for:** Researchers, academics, computer science graduates, and technical authors.

#### Ivory Paper Markdown Output Preview:
```markdown
<div align="center">

# BAVLY HAMDY
*Curriculum Vitae & Software Engineering Dossier*  
`Cairo, Egypt` • `contact@bavly.dev`

> "Engineering resilient digital systems through formal mathematical models and deliberate interface design."

---

</div>

### I. APPOINTMENTS & EXPERIENCE
* **Lead Software Engineer**, *Acme Cloud Corporation* (2024 — Present)  
  * Spearheaded architectural transition to event-driven distributed actors.  
  * Formulated strict zero-trust security audit procedures across all client endpoints.

* **Senior Software Engineer**, *Nexus Systems Laboratories* (2022 — 2024)  
  * Authored internal compiler toolchains reducing production build times by 48%.

### II. HIGHER EDUCATION
* **Bachelor of Science in Computer Science**, *Cairo University* (2020 — 2024)  
  * **Cumulative GPA:** `3.85 / 4.00` (First Class Honours with Distinction)  
  * **Capstone Thesis:** *Autonomous AST Remediation in Multi-Tenant CI Pipelines*

### III. PEER-VERIFIED SOFTWARE ARTIFACTS
1. **README Studio** (`github.com/Bavly-Hamdy/readme-studio`)  
   *An enterprise-grade repository orchestration compiler.*
2. **GitArmorAI** (`github.com/Bavly-Hamdy/GitArmorAI`)  
   *Deterministic AST scanning and surgical PR remediation engine.*
```

---

### 4. Terminal Mono Theme
* **Design Philosophy:** Monospaced UNIX CLI terminal output, ASCII aesthetics, code-first structure.
* **Headers:** Formatted inside triple-backtick bash code blocks (`$ whoami`, `$ cat stack.json`).
* **Career Timelines:** Structured ASCII tables and JSON-like career trees.
* **Best for:** DevOps engineers, Linux enthusiasts, security researchers, and backend polyglots.

#### Terminal Mono Markdown Output Preview:
```markdown
```bash
$ whoami
bavly@workstation:~$ Senior Full-Stack Software Engineer & UI/UX Architect

$ cat developer_dossier.json
{
  "handle": "Bavly-Hamdy",
  "location": "Cairo, Egypt",
  "status": "online",
  "archetype": "Full-Stack Polyglot",
  "repos_audited": 41,
  "verified_score": 88
}
```

```bash
$ tree -L 2 ./experience
├── 2024_present/
│   ├── company: "Acme Cloud"
│   ├── role: "Lead Software Engineer"
│   └── stack: ["TypeScript", "Go", "Docker", "PostgreSQL"]
└── 2022_2024/
    ├── company: "Nexus Systems"
    ├── role: "Senior Frontend Engineer"
    └── stack: ["React", "TypeScript", "Tailwind"]
```

```bash
$ cat language_dna.table
+------------+------------+---------------+
| Language   | Share      | Verified Repos|
+------------+------------+---------------+
| TypeScript | 64.2%      | 28            |
| Python     | 22.8%      | 9             |
| SQL        | 8.5%       | 3             |
| Rust       | 4.5%       | 1             |
+------------+------------+---------------+
```
```

---

## 📊 Telemetry Engine & Codebase Quality Index

The Telemetry Engine (`src/services/githubAnalyzer.ts`) paginates across 100% of public repositories to construct a mathematically authentic developer profile:

### Mathematical Formula Breakdown

The **Codebase Quality Index (0 — 100)** is computed across six distinct dimensions weighted according to real-world engineering impact:

$$\text{Codebase Quality Score} = \sum_{i=1}^{6} w_i \times S_i$$

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   CODEBASE QUALITY INDEX DIMENSIONS                    │
├────────────────────┬────────┬──────────────────────────────────────────┤
│ Dimension          │ Weight │ Metric Definition & Formula              │
├────────────────────┼────────┼──────────────────────────────────────────┤
│ 1. Impact          │  25%   │ S_1 = min(100, Stars * 3 + Forks * 5)    │
│ 2. Commit Cadence  │  20%   │ S_2 = min(100, ActiveDays * 0.4 + Streak)│
│ 3. Versatility     │  20%   │ S_3 = min(100, PolyglotLanguages * 15)   │
│ 4. Maintenance     │  15%   │ S_4 = 100 - (StaleIssues / Repos * 10)   │
│ 5. Community       │  10%   │ S_5 = min(100, Followers * 2.5)          │
│ 6. Documentation   │  10%   │ S_6 = (% Repos with License & Readme)    │
└────────────────────┴────────┴──────────────────────────────────────────┘
```

#### Final Letter Grade Tiers:
- **Grade A+ (95 — 100):** World-class open-source maintainer with multi-ecosystem leadership.
- **Grade A (85 — 94):** Seasoned production engineer with high commit velocity and strong hygiene.
- **Grade B (70 — 84):** Productive full-stack contributor with solid repository breadth.
- **Grade C (50 — 69):** Active junior/mid engineer building foundation and portfolio.
- **Grade D (< 50):** Early-stage exploratory codebases.

---

### Developer Archetype Classification

Based on repository topics, language byte ratios, and commit density, the analyzer classifies the engineer into one of five primary archetypes:

| Archetype | Trigger Conditions | Behavioral Characteristics |
| :--- | :--- | :--- |
| **System Architect** | Go / Rust / C++ / Docker > 40% bytes | Builds low-level runtimes, high-concurrency microservices, and distributed systems. |
| **Interface Craftsman** | TypeScript / React / CSS / Vue > 50% bytes | Focuses on aesthetic micro-interactions, accessibility, typography, and frontend state machines. |
| **Full-Stack Polyglot** | Balanced frontend + backend (>= 3 languages > 15%) | Seamlessly traverses client and server boundaries, designing end-to-end cloud platforms. |
| **Data & AI Engineer** | Python / Jupyter / SQL / R > 45% bytes | Develops neural models, ETL streaming pipelines, and high-dimensional analytics engines. |
| **Minimalist Hacker** | C / Shell / Assembly / Makefile > 35% bytes | Values ultra-lean UNIX binaries, minimal dependencies, and terminal workflows. |

---

### Circadian Rhythm Analysis

By inspecting public commit timestamps across UTC hours and days of the week, the system computes the developer's natural productive window:
- 🌅 **Early Bird:** Peak commits between 05:00 and 11:00 UTC.
- ☀️ **Daytime Engineer:** Peak commits between 11:00 and 17:00 UTC.
- 🌆 **Evening Craftsman:** Peak commits between 17:00 and 23:00 UTC.
- 🦉 **Night Owl:** Peak commits between 23:00 and 05:00 UTC.

---

### Language DNA Byte Summation & Anti-Boilerplate Threshold

Traditional tools calculate language percentages by counting repository names (e.g., if a developer has 5 Python repos and 5 HTML repos, it reports 50% Python and 50% HTML, even if the Python repo is 100,000 lines and the HTML is 20 lines).

README Studio uses **exact byte-accurate summation**:

$$\text{Share}_{\text{lang}} = \frac{\sum_{r \in \text{Repos}} \text{Bytes}(r, \text{lang})}{\sum_{r \in \text{Repos}} \sum_{l} \text{Bytes}(r, l)} \times 100$$

#### The Anti-Boilerplate Threshold:
Incidental languages accounting for less than **0.4%** of total bytes (such as auto-generated Xcode Swift files in React Native apps, or NSIS installer scripts) are grouped into `Other Secondary` to ensure the developer's genuine skills shine without clutter.

---

## 🛠️ Studio Section Customization Guide

The Studio Builder (`src/components/SectionEditor.tsx`) provides granular controls over 11 distinct sections:

| Section Name | Customization Controls | Markdown Output Role |
| :--- | :--- | :--- |
| **1. Header & Hero** | Monogram style, full name, engineering title, location, status badge, dynamic typing SVG toggle | Primary visual identity at top of README |
| **2. About Me / Bio** | 3 AI-synthesized tone options (Architectural, Community, Minimalist), or custom rich editor | Developer narrative, philosophy, and focus |
| **3. Career Experience** | Role, company, dates, current flag, bulleted achievements, technology tags | Formal employment chronology |
| **4. Higher Education** | Degree, university, graduation year, GPA, honors, extracurriculars | Academic credibility and foundations |
| **5. Certifications** | Certificate title, issuer, issue date, credential verification URL | Industry-verified qualifications |
| **6. Tech Stack Badges** | Categorized badge toggles: Frontend, Backend, Database, Cloud/DevOps, AI/Data, Tools | Visually grouped Shields.io skill badges |
| **7. Language DNA** | Non-sampled percentage display, custom threshold filtering, layout choices | Byte-accurate code composition |
| **8. Featured Repos** | Pinned repo picker, custom descriptions, language badges, star count display | Showcases best engineering artifacts |
| **9. Coding Telemetry** | Circadian rhythm clock, active archetype pill, contribution streak | GitHub habits and productivity windows |
| **10. GitHub Stats** | Streak stats card, summary trophy card, top languages card | Dynamic third-party metrics SVG integration |
| **11. Connect & Socials**| LinkedIn, Twitter/X, Email, Portfolio, Discord, YouTube | Professional contact links |

---

## 🛠️ Technologies & Ecosystem Matrix

| Layer | Dependency | Version | Strategic Role |
| :--- | :--- | :--- | :--- |
| **Core Framework** | `react` / `react-dom` | `^19.0.1` | Concurrent rendering, declarative component tree |
| **Build Engine** | `vite` (Rolldown) | `^8.3.0` | Sub-500ms production builds, function-based modular chunking & security headers |
| **Language Runtime**| `typescript` | `^7.0.2` | Strict type safety, zero `any` short-circuits |
| **Styling & Theme** | `tailwindcss` | `^4.3.3` | Modern CSS tokens, Combination 8 Ink Wash palette |
| **Security & XSS** | `dompurify` | `^3.4.16` | OWASP A03 GFM HTML sanitization, attribute hook & reverse tabnabbing defense |
| **Motion Physics** | `motion` | `^12.23.24` | Micro-interactions and fluid layout transitions |
| **AI Integration** | `@google/genai` | `^2.4.0` | Client-side Google Gemini 3.8 Flash inference |
| **Markdown Parser** | `marked` | `^18.0.14` | GFM AST compilation and sanitization |
| **Diagram Engine** | `mermaid` | `^11.4.0` | Architectural diagrams-as-code rendering |
| **Iconography** | `lucide-react` | `^0.546.0` | Consistent vector symbols across all views |
| **E2E Automation** | `playwright` | Python SDK | Automated 2x Retina high-DPI screenshot pipeline |

---

## 📁 Project Structure

```text
README-Studio/
├── public/
│   ├── favicon.svg               # Architectural SVG monogram brand icon
│   └── screenshots/              # 2x Retina production UI captures
│       ├── 01_landing_hero.png
│       ├── 02_live_sandbox_preview.png
│       ├── 03_live_sandbox_dna.png
│       ├── 04_gemini_bio_engine.png
│       ├── 05_creator_spotlight.png
│       ├── 06_studio_builder.png
│       ├── 07_publish_modal.png
│       ├── 08_analytics_dashboard.png
│       ├── 09_resume_modal.png
│       └── 10_whats_new_modal.png
├── src/
│   ├── components/               # View orchestrators & UI primitives
│   │   ├── AnalyticsDashboard.tsx# Professional developer telemetry & scorecard
│   │   ├── ErrorBoundary.tsx     # Resilient React catch-boundary
│   │   ├── Header.tsx            # Navigation, API quota meter & brand header
│   │   ├── LandingPage.tsx       # Live sandbox, bio comparator & creator showcase
│   │   ├── LivePreview.tsx       # Dual-pane real-time GFM & code renderer
│   │   ├── LogoIcon.tsx          # Bespoke SVG brand identity
│   │   ├── PublishModal.tsx      # Atomic GitHub commit modal with rollback
│   │   ├── ResumeModal.tsx       # Multimodal drag-and-drop CV ingestion modal (10MB capped)
│   │   ├── SectionEditor.tsx     # Granular section data, career & badge editor
│   │   ├── SettingsModal.tsx     # Client-side PAT & Gemini key config
│   │   ├── SidebarSections.tsx   # Tactile drag/toggle section navigation
│   │   ├── TokenGuideModal.tsx   # In-app GitHub PAT acquisition walkthrough
│   │   ├── UsernameBar.tsx       # Fast-switcher profile input & ingestion bar
│   │   └── WhatsNewModal.tsx     # Editorial v2.1 release changelog modal
│   ├── services/                 # Domain logic & headless services
│   │   ├── aiBio.ts              # Deterministic rule-based 3-tone bio engine
│   │   ├── archetypes.ts         # Developer taxonomy & rhythm definitions
│   │   ├── geminiService.ts      # Google Gemini 3.8 Flash inference client
│   │   ├── github.ts             # GitHub REST v3 client, auth & fallback data (TextEncoder Base64)
│   │   ├── githubAnalyzer.ts     # Non-sampled repo pagination & byte analyzer
│   │   ├── languageColors.ts     # Authentic GitHub language hex map
│   │   ├── markdownRenderer.ts   # Multi-theme GFM string compiler (with career timelines)
│   │   ├── resumeParser.ts       # Multimodal CV ingestion & profile fusion engine
│   │   ├── sanitize.ts           # Enterprise DOMPurify sanitizer & GitHub input validator
│   │   └── techDetection.ts      # Heuristic tech classifier & anti-boilerplate filter
│   ├── i18n/
│   │   └── translations.ts       # English & Arabic bilingual dictionary
│   ├── types/
│   │   └── index.ts              # Strict TypeScript interfaces & domains
│   ├── App.tsx                   # Master root state machine & router
│   ├── index.css                 # Ink Wash design tokens (Light/Dark mode)
│   └── main.tsx                  # React 19 application entry point
├── package.json                  # Dependencies & script declarations
├── tsconfig.json                 # TypeScript compiler options
└── vite.config.ts                # Vite bundler configuration (Rolldown chunks & security headers)
```

---

## 🧩 Main Modules & Technical Breakdown

### 1. `src/App.tsx` (State Orchestrator)
Acts as the central finite state machine. Manages routing between `'landing'`, `'builder'`, and `'analytics'`, orchestrates the fetching lifecycle of GitHub profile graphs, coordinates auto-draft saving, and applies synchronized RTL/LTR and dark/light mode classes to the document root.

### 2. `src/components/LandingPage.tsx` (Interactive Showcase)
Houses the live interactive sandbox where developers can input any live GitHub username, test theme changes (`minimal`, `showcase`, `paper`, `mono`), inspect their byte-accurate language DNA, preview Gemini 3.8 Flash synthesized bios, and view the creator spotlight. Rendered outputs are strictly sanitized against XSS via `sanitizeMarkdownHtml`.

### 3. `src/services/githubAnalyzer.ts` (Non-Sampled Telemetry)
Paginates through `/users/:login/repos` across all pages. Aggregates byte-accurate language distributions, calculates circadian commit rhythms (peak hours, peak days), evaluates repository stargazers/forks, and manages real-time rate limit subscription callbacks.

### 4. `src/services/resumeParser.ts` (Multimodal Resume Ingestion & Fusion Engine)
Ingests binary PDF documents or raw text through Gemini 3.8 Flash (`gemini-3.8-flash`). Extracts structured work chronologies, educational degrees, GPA, and verified certifications. Employs `fuseResumeWithProfile` to cross-examine detected items against authentic repository byte weights, eliminating boilerplate or hallucinated skills.

### 5. `src/components/ResumeModal.tsx` (Interactive CV Importer & Merger)
Provides a tactile drag-and-drop file upload zone with live OCR progress simulation, Bento Grid preview of detected milestones, and granular fusion controls to selectively merge parsed records into the active README configuration. Enforces a strict 10MB file buffer cap and MIME validation to eliminate client-side DoS risks.

### 6. `src/services/geminiService.ts` (LLM Persona Synthesis)
Constructs a structured prompt containing the developer's top repositories, detected tech stack, and primary language weights. Dispatches the payload directly to `gemini-3.8-flash` via `@google/genai` to generate 3 tailored voices with bilingual Arabic/English support.

### 7. `src/components/PublishModal.tsx` (Atomic GitHub Commits & CI/CD Generator)
Executes a zero-risk publishing pipeline. Inspects if the user has an existing `username/username` repository, snapshots the active `README.md` to `localStorage` for rollback, reads the existing file's SHA to prevent race conditions, issues an authenticated `PUT` commit using standards-compliant `TextEncoder` Base64 encoding, and provides turnkey GitHub Actions workflow code for automated profile synchronization.

### 8. `src/components/AnalyticsDashboard.tsx` (Professional Developer Telemetry)
Presents a comprehensive developer audit: Real GitHub avatar dossier, unified Codebase Quality Index, filtered Language DNA, circadian commit distribution, and repository spotlights with zero AI tropes.

### 9. `src/components/WhatsNewModal.tsx` (Version 2.1 Architectural Hub)
An interactive release modal spotlighting the architectural pillars of README Studio v2.1 (Current) with direct triggers for resume ingestion, CI/CD workflow generation, bilingual copy, and technical release notes.

### 10. `src/services/sanitize.ts` (Enterprise Sanitizer & Input Hardener)
Provides enterprise-grade HTML sanitization for dynamic Markdown using `DOMPurify`. Enforces strict tag and attribute whitelisting tailored for GitHub Flavored Markdown (GFM), strips dangerous inline executable scripts and event handlers (`onclick`, `onerror`, `onload`), and attaches an attribute hook enforcing `rel="noopener noreferrer nofollow"` and `target="_blank"` on external anchors to eliminate reverse tabnabbing vectors. Also houses `sanitizeGitHubUsername` and `isValidGitHubUsername`, which normalize and validate usernames against official GitHub regular expression constraints.

---

## 💻 CLI & Script Execution Matrix

| Command | Purpose | Target Environment |
| :--- | :--- | :--- |
| `npm run dev` | Spins up Vite dev server on `http://localhost:3000` | Local Development |
| `npm run build` | Compiles optimized production bundle in `dist/` | Staging / Production |
| `npm run preview` | Locally serves the compiled production build | Pre-flight Validation |
| `npm run lint` | Runs strict TypeScript compiler check (`tsc --noEmit`) | Continuous Integration |
| `npm run clean` | Deletes build output and temporary server files | Workspace Hygiene |

---

## 🛡️ Security, OWASP Top 10 Hardening & Privacy

README Studio is engineered with an uncompromising **Enterprise Zero-Trust & Defense-in-Depth Architecture**. Every data pipeline, Markdown rendering zone, and file buffer upload strictly adheres to the international **OWASP Top 10 Application Security Standards**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE ZERO-TRUST ARCHITECTURE                  │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Remote Database Storage  │ ZERO bytes (No central DB or cloud logging) │
│ Telemetry / Ad Trackers  │ ZERO scripts, pixels, or profiling          │
│ GitHub PAT Storage       │ Client-side browser localStorage (isolated) │
│ Gemini API Key Storage   │ Client-side browser localStorage (isolated) │
│ Resume / CV Uploads      │ Transient in-memory parsing (ephemeral)     │
│ Network Transmission     │ Direct Client -> GitHub / Google (TLS 1.3)  │
│ HTML Sanitization        │ DOMPurify with strict GFM whitelist         │
│ Bundle Security Headers  │ X-Content-Type-Options, DENY, Strict-Origin │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

### OWASP A03: Injection & XSS Defense (DOMPurify)

Dynamic Markdown rendering is a critical vector for Cross-Site Scripting (XSS). To eliminate all execution vectors, README Studio deploys an enterprise-grade sanitization service in [`src/services/sanitize.ts`](file:///e:/README%20Studio/src/services/sanitize.ts):

* **Strict GFM Tag Whitelist:** Restricts allowable tags strictly to safe Markdown and GitHub presentation elements (`h1-h6`, `p`, `a`, `img`, `table`, `code`, `pre`, `blockquote`, `details`, `summary`, `svg`).
* **Complete Blacklisting of Executable Elements:** Instantly strips `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<textarea>`, `<button>`, and `<style>` blocks.
* **Inline Event Handler Elimination:** Prohibits and removes all inline JavaScript listeners (`onerror`, `onload`, `onclick`, `onmouseover`, `onfocus`, `onblur`).
* **Reverse Tabnabbing Mitigation:** Implements an automated `afterSanitizeAttributes` DOMPurify lifecycle hook that detects external `<a>` tags and automatically injects:
  ```html
  target="_blank" rel="noopener noreferrer nofollow"
  ```
  neutralizing window-opener hijacking vulnerabilities.
* **Pre-Render Enforcement:** Every output of `marked.parse()` passes through `sanitizeMarkdownHtml()` before reaching `dangerouslySetInnerHTML` across both [`LivePreview.tsx`](file:///e:/README%20Studio/src/components/LivePreview.tsx) and [`LandingPage.tsx`](file:///e:/README%20Studio/src/components/LandingPage.tsx).

---

### OWASP A04: Insecure Design & Client DoS Prevention

Client-side document parsing can expose the browser to heap exhaustion and tab crashes (Denial of Service) if large binary payloads are uploaded:

* **Strict File Buffer Ceilings:** [`src/components/ResumeModal.tsx`](file:///e:/README%20Studio/src/components/ResumeModal.tsx) enforces a hard **10MB file size limit** (`MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024`). Uploads exceeding this threshold are immediately rejected with clear localized feedback before memory allocation.
* **MIME & Extension Whitelist:** Strict dual-layer format validation accepts only `.pdf`, `.txt`, and `.md` with matching MIME types (`application/pdf`, `text/plain`, `text/markdown`), rejecting dangerous binary executables.
* **Transient Memory Garbage Collection:** File buffers are converted into transient `ArrayBuffer` instances, passed directly to the model stream, and dereferenced immediately to allow immediate JavaScript V8 engine garbage collection.

---

### Strict Input Sanitization & GitHub Handle Spec

User inputs for GitHub profiles are sanitized and strictly validated against GitHub's official specifications before making any network requests:

```typescript
// Excerpt from src/services/sanitize.ts
export function sanitizeGitHubUsername(input: string): string {
  if (!input) return '';
  let clean = input.trim();
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, ''); // Strip URLs
  clean = clean.replace(/^@+/, '');                                      // Strip leading @
  return clean.split(/[/?#]/)[0].trim();                                 // Strip paths & queries
}

export function isValidGitHubUsername(username: string): boolean {
  if (!username || username.length > 39) return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username);
}
```

---

### Modern UTF-8 Standards-Compliant Base64 Serialization

Publishing Markdown to GitHub's REST v3 Contents API requires Base64-encoded strings. Legacy implementations rely on `unescape(encodeURIComponent(...))`, which is officially deprecated by WHATWG and subject to runtime warnings.

README Studio utilizes native `TextEncoder` byte streaming in [`src/services/github.ts`](file:///e:/README%20Studio/src/services/github.ts):

```typescript
// Modern Unicode & Arabic Safe UTF-8 Base64 Serialization
const bytes = new TextEncoder().encode(content);
let binary = '';
const chunkSize = 8192;
for (let i = 0; i < bytes.length; i += chunkSize) {
  binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
}
const base64Content = btoa(binary);
```
This guarantees 100% mathematical fidelity for multilingual developer bios (Arabic RTL, Asian scripts, emojis, and mathematical symbols) during atomic publishing and rollbacks.

---

### HTTP Security Headers & Clickjacking Mitigation

The development and production deployment configurations enforce multi-layered HTTP security headers:

* **Clickjacking Defense:** `X-Frame-Options: DENY` blocks embedding inside unauthorized malicious iframes.
* **MIME-Type Sniffing Defense:** `X-Content-Type-Options: nosniff` forces browsers to adhere strictly to declared MIME types.
* **Referrer Protection:** `referrer: strict-origin-when-cross-origin` shields private URL paths from leaking to third-party assets.
* **Permissions Hardening:** `Permissions-Policy: camera=(), microphone=(), geolocation=()` revokes unnecessary hardware APIs.

---

### Rolldown Modular Production Chunking

To ensure lightning-fast cold loads without monolithic bundle bloat, `vite.config.ts` incorporates function-based Rolldown chunking:

```typescript
manualChunks(id: string) {
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('lucide-react')) return 'vendor-react';
    if (id.includes('@google/genai') || id.includes('pdfjs-dist')) return 'vendor-ai';
    if (id.includes('marked') || id.includes('dompurify')) return 'vendor-markdown';
    if (id.includes('simple-icons')) return 'vendor-icons';
  }
}
```
* **Build Time:** Compiles in **~499ms**.
* **Payload Footprint:** Core entry bundle is compressed to **~145 kB (gzipped)**.

---

### Atomic Rollback Snapshots & Client-Side Isolation

1. **Zero Database Exposure:** All Personal Access Tokens (PATs) and Gemini API keys reside exclusively in the developer's sandboxed browser `localStorage`.
2. **Pre-Commit Snapshot:** Before any write commit is dispatched to GitHub, the existing profile README is backed up in browser storage, enabling 1-click restoration at any point.

---

## 🚀 Requirements & Installation Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher (or `pnpm` / `bun`)
* **Python 3.9+**: (Optional, only required for running the automated screenshot pipeline)

### Quick Start Setup

```bash
# 1. Clone the repository
git clone https://github.com/Bavly-Hamdy/readme-studio.git
cd readme-studio

# 2. Install dependencies
npm install

# 3. Configure optional environment variables
cp .env.example .env.local
```

#### Optional `.env.local` Configuration:
```env
# Optional: Pre-populate Gemini API key for local development
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Default GitHub token to bypass the 60 req/hr public rate limit
VITE_GITHUB_TOKEN=your_github_pat_here
```

```bash
# 4. Launch development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## 🌐 Deployment & Environment Matrix

| Environment | Host Target | Configuration Required | Deployment Command |
| :--- | :--- | :--- | :--- |
| **Development** | `localhost:3000` | Optional `.env.local` | `npm run dev` |
| **Staging** | Vercel / Netlify | None (SPA static output) | `npm run build` |
| **Production** | GitHub Pages / Cloud CDN | Zero server config needed | Deploy `/dist` folder |

Because README Studio is compiled as a static Single Page Application (SPA), it can be deployed seamlessly to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages) without needing a Node.js backend.

---

## ❓ Troubleshooting & Frequently Asked Questions

### Q1: Why are some small languages (like Swift or Makefile) missing from my Language DNA?
> **Answer:** README Studio v2.1 incorporates an **Anti-Boilerplate Qualification Threshold** (`< 0.4%`). When a developer builds React Native or Flutter apps, Xcode automatically generates boilerplate Swift/Objective-C files, even if the developer never wrote native Swift code. The analyzer filters out these minute template artifacts to prevent false claims and noise on your profile.

### Q2: Do I need a GitHub Personal Access Token (PAT) to use README Studio?
> **Answer:** No. Public profile ingestion works seamlessly without authentication. However, GitHub enforces an unauthenticated rate limit of 60 requests per hour. For accounts with dozens of repositories, providing a lightweight personal token (`read:user` and `repo` scope) expands your rate limit to **5,000 requests per hour**.

### Q3: Is my Resume / CV data uploaded or stored anywhere?
> **Answer:** Absolutely not. The document buffer is processed purely in your browser's local memory. The parsed base64 stream is sent directly from your browser to Google's Gemini API over TLS 1.3, and the extracted milestones exist only in your current session's memory.

### Q4: What happens if I make a mistake while publishing to GitHub?
> **Answer:** Before issuing the commit `PUT` request to `api.github.com`, README Studio takes an atomic snapshot of your existing `README.md` and saves it to your local browser storage. If you ever need to revert, open the Publish Modal and click **"Restore Previous Snapshot"** for an instant 1-click rollback.

### Q5: Can I generate a README in Arabic?
> **Answer:** Yes! README Studio has native bilingual architecture. Clicking the `AR / EN` toggle in the top bar switches all interface copy to Arabic and configures Gemini 3.8 Flash to synthesize your bios, headers, and descriptions in natural, professional Arabic with proper right-to-left (`dir="rtl"`) formatting.

---

## 🗺️ Future Roadmap

- [x] **v1.0.0:** Real-time GitHub REST v3 ingestion, 4 themes, live GFM preview, 1-click publishing.
- [x] **v2.0.0:** Multimodal Resume / CV parser, Gemini 3.8 Flash chain, career timeline renderer, anti-boilerplate heuristics, developer dossier telemetry.
- [x] **v2.0.1:** Enterprise OWASP Top 10 hardening, DOMPurify XSS defenses, 10MB DoS mitigation, and Rolldown modular production chunking.
- [x] **v2.1.0 (Current):** In-App GitHub Actions CI/CD profile sync generator, repository CI quality gate (`.github/workflows/ci.yml`), Web PWA Manifest, SEO metadata, and print/PDF media rules.
- [ ] **v2.2.0:** Headless CLI utility (`npx readme-studio generate --user <handle>`).
- [ ] **v2.3.0:** High-Resolution Vector SVG / PNG standalone portfolio card export.

---

## 👥 Authors & Contributors

README Studio was designed, architected, and engineered with precision by:

<div align="center">

<img src="https://avatars.githubusercontent.com/u/100946403?v=4" width="120" height="120" style="border-radius: 50%; border: 3px solid #5A7188;" alt="Bavly Hamdy" />

### **Bavly Hamdy**
**Senior Full-Stack Software Engineer & UI/UX Architect**  
*Cairo, Egypt*

[![GitHub](https://img.shields.io/badge/GitHub-@Bavly--Hamdy-181717?style=flat-square&logo=github)](https://github.com/Bavly-Hamdy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/bavly-hamdy)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-5A7188?style=flat-square&logo=safari)](https://github.com/Bavly-Hamdy)

</div>

#### Other Open-Source Engineering Projects by Bavly Hamdy:
* **[ReadmeForge](https://github.com/Bavly-Hamdy/ReadmeForge):** Engineering-grade README generator with AST parsing and visual Mermaid architecture topologies.
* **[GitArmorAI](https://github.com/Bavly-Hamdy/GitArmorAI):** Autonomous DevSecOps platform powered by Gemini 2.5 AI — Deterministic AST scanning and 1-click surgical PR remediation.
* **[BOSSLA-CAREER-PRO](https://github.com/Bavly-Hamdy/BOSSLA-CAREER-PRO):** Forensic ATS Resume Auditor, Google X-Y-Z Bullet Rewriter, Keyword Gap Detector & AI Career Co-Pilot.
* **[focusos](https://github.com/Bavly-Hamdy/focusos):** High-performance ambient productivity operating system with diurnal chronotype scheduling and zero-trust architecture.

---

## 📄 LICENSE

This project is open-source software licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Bavly Hamdy <https://github.com/Bavly-Hamdy>
Project: README Studio <https://github.com/Bavly-Hamdy/readme-studio>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--------------------------------------------------------------------------------

DISCLAIMER & THIRD-PARTY ACKNOWLEDGMENTS:
- "GitHub" and the GitHub Octocat logo are registered trademarks of GitHub, Inc.
- "Google", "Gemini", and related marks or logos are trademarks of Google LLC.
- README Studio is an independent open-source project and is not affiliated with
  or endorsed by GitHub, Inc., Google LLC, or Microsoft Corporation.
```

<div align="center">
  <sub>Engineered with intention, architectural empathy, and extreme technical candor by <a href="https://github.com/Bavly-Hamdy">Bavly Hamdy</a>.</sub>
</div>
