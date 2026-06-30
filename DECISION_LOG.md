# Decision Log

[DECISION] Backend: Firebase Functions (not Express)
[ALTERNATIVES] Minimal Node/Express server
[REASON] Assignment explicitly prefers Firebase Functions; pairs cleanly with Firebase Hosting for single-command deploy; forces real exposure to Firebase's serverless model which is new to me and worth learning
[TRADE-OFFS] Slightly steeper local setup (Firebase CLI, emulators) vs. an Express server I could write blind. Cold starts on free tier vs. always-warm Express process.

[DECISION] Frontend: Vite + React + TypeScript
[ALTERNATIVES] Next.js
[REASON] This is a small two-screen app (form + list) with no routing or SSR needs. Vite gives faster local iteration and less boilerplate for the scope.
[TRADE-OFFS] No built-in API routes or SSR if the app ever grows.

[DECISION] Storage: Firestore, single top-level collection "entries"
[ALTERNATIVES] Subcollections per user, or a relational-style normalized schema
[REASON] No user accounts in this assignment (anonymous posting), entries are flat objects with no relations — a single collection queried by `orderBy(createdAt, desc).limit(20)` is the simplest correct model
[TRADE-OFFS] At scale, a single collection with one sort field becomes a hot collection; would need sharding or pagination cursors eventually (covered in Part 2)

[DECISION] Auth: hard-coded API key via x-api-key header
[ALTERNATIVES] Firebase Auth (full user accounts), JWT-based service tokens
[REASON] Assignment explicitly asks for this as an intentionally simple mechanism; full auth is out of scope for a 4-6 hour build
[TRADE-OFFS] Key must be rotated manually, no per-user attribution, key works for any caller who has it. Production alternative discussed in Part 2.

[DECISION] ML/AI stretch: Option A, keyword-based toxicity filter as Express middleware
[ALTERNATIVES] Option B (Gemini API call on write to generate tags/summaries)
[REASON] Option A is fast, deterministic, and provably testable within the time budget (verified via Postman). Option B requires external API dependency and adds failure modes (network calls, rate limits, API key management) that risk eating the time budget for a "stretch" feature
[TRADE-OFFS] Far less sophisticated than a real classifier -- no context awareness, easily bypassed by spelling variations, English-only keyword list. Documented as a known limitation, not presented as production-grade moderation.

[DECISION] Service account auth for seed script, not emulator-based Firestore
[ALTERNATIVES] Running the Firestore emulator with fake local data
[REASON] Wanted the reviewer to see real seeded data in actual production Firestore immediately, not a local-only emulator state that disappears on restart
[TRADE-OFFS] Seed script requires a service account key file (gitignored, never committed) rather than being runnable by anyone without credentials -- documented in README as a one-time setup step

