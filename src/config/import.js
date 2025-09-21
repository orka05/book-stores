import admin from "firebase-admin";
import fs from "fs";

// Load service account key via fs
const serviceAccount = JSON.parse(
  fs.readFileSync("./src/config/serviceAccount.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Read your JSON data
const data = JSON.parse(fs.readFileSync("./src/config/data2025.json", "utf8"));

// Loop through collections and documents
async function importData() {
  for (const [collection, documents] of Object.entries(data)) {
    for (const [docId, docData] of Object.entries(documents)) {
      await db.collection(collection).doc(docId).set(docData);
      console.log(`✅ Imported ${collection}/${docId}`);
    }
  }
  console.log("🎉 All data imported successfully!");
}

importData().catch(console.error);// npm run import