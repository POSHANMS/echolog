import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";

if (getApps().length === 0) {
  // Check for secret file (Render) or fall back to ADC (Firebase Functions)
  const secretPath = "/etc/secrets/serviceAccountKey.json";
  const localPath = path.resolve(__dirname, "../../serviceAccountKey.json");

  if (fs.existsSync(secretPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(secretPath, "utf8"));
    initializeApp({ credential: cert(serviceAccount) });
  } else if (fs.existsSync(localPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(localPath, "utf8"));
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    // Firebase Functions environment — uses ADC automatically
    initializeApp();
  }
}

export const db = getFirestore();
export const ENTRIES_COLLECTION = "entries";