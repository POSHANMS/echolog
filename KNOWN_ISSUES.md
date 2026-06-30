# Known Issues

- Toxicity filter is keyword-based, not a real ML classifier. Easily bypassed by misspellings, leetspeak, or non-English text. Deferred: a real classifier (e.g. Perspective API or a small fine-tuned model) was out of scope for the time budget.
- Functions emulator defaults to `us-central1` region rather than `asia-south1` (where Firestore lives). Functionally fine (cross-region calls work), but adds minor latency. Not fixed because it requires explicit region pinning in `functions/src/index.ts` and wasn't worth the time trade-off for a take-home.
- No rate limiting on the write endpoint. A malicious caller with the API key could spam entries. Deferred -- production fix would be a rate limiter (e.g. per-IP or per-key) noted in Part 2's auth trade-offs section.
- No pagination beyond the first 20 entries. Read endpoint always returns exactly the latest 20; there's no "load more" capability. Acceptable per assignment scope (it only asks for the 20 most recent).