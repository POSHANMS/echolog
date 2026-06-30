import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export const db = getFirestore();
export const ENTRIES_COLLECTION = "entries";