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