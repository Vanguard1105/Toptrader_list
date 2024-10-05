// db.ts
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://vanguard951105:F0Y7B0MtjvH1OFbL@cluster0.haemz.mongodb.net/"; // Your MongoDB URI
const client = new MongoClient(uri);

export async function connectToDatabase() {
  // if (!client.isConnected()) await client.connect();
  const db = client.db('Dexscreener'); // Replace with your database name
  return db;
}