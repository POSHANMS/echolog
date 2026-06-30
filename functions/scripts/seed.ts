import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as serviceAccount from "../serviceAccountKey.json";

initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore();

const SAMPLE_ENTRIES = [
  "Shipped the auth middleware today, feels good to have a clean header check.",
  "Reminder to self: always validate input on the server, never trust the client.",
  "Coffee farm update: pruning the Robusta rows this week before the rains hit.",
  "Debugging Firestore query ordering for an hour just to find a missing index.",
  "First deploy to Firebase Hosting went smoother than expected. Small win.",
  "Working through a take-home assignment tonight, deep in TypeScript types."
];

async function seed() {
  console.log("Seeding Firestore with sample entries...");

  for (let i = 0; i < SAMPLE_ENTRIES.length; i++) {
    // Stagger timestamps slightly so ordering is meaningful, not all identical
    const createdAt = Timestamp.fromMillis(Date.now() - (SAMPLE_ENTRIES.length - i) * 60000);

    const docRef = await db.collection("entries").add({
      text: SAMPLE_ENTRIES[i],
      createdAt
    });

    console.log(`Added entry ${docRef.id}: "${SAMPLE_ENTRIES[i].slice(0, 40)}..."`);
  }

  console.log("Seeding complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed script failed:", err);
    process.exit(1);
  });