import { MongoClient } from "npm:mongodb";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("MONGODB_DB") ?? "workshophub";

let client: MongoClient | null = null;
let db: ReturnType<MongoClient["db"]> | null = null;

export const isMongoEnabled = Boolean(MONGODB_URI);

const getClient = async (): Promise<MongoClient> => {
  if (client) return client;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required for MongoDB storage");
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
};

const getDatabase = async () => {
  if (db) return db;
  const mongoClient = await getClient();
  db = mongoClient.db(DB_NAME);

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("workshops").createIndex({ id: 1 }, { unique: true }),
    db.collection("bookings").createIndex({ id: 1 }, { unique: true }),
    db.collection("payments").createIndex({ id: 1 }, { unique: true }),
    db.collection("events").createIndex({ timestamp: -1 }),
  ]);

  return db;
};

const splitKey = (key: string) => {
  if (key.startsWith("user:")) {
    return { collection: "users", id: key.slice(5) };
  }
  if (key.startsWith("workshop:")) {
    return { collection: "workshops", id: key.slice(9) };
  }
  if (key.startsWith("booking:")) {
    return { collection: "bookings", id: key.slice(8) };
  }
  if (key.startsWith("payment:")) {
    return { collection: "payments", id: key.slice(8) };
  }
  return { collection: "kv_store", id: key };
};

const getCollection = async (collectionName: string) => {
  const database = await getDatabase();
  return database.collection(collectionName);
};

export const set = async (key: string, value: any): Promise<void> => {
  const { collection, id } = splitKey(key);
  const col = await getCollection(collection);

  if (collection === "kv_store") {
    await col.updateOne({ key }, { $set: { key, value } }, { upsert: true });
    return;
  }

  if (collection === "users") {
    await col.updateOne({ email: id }, { $set: { ...value, email: id } }, { upsert: true });
    return;
  }

  await col.updateOne({ id }, { $set: { ...value, id } }, { upsert: true });
};

export const get = async (key: string): Promise<any> => {
  const { collection, id } = splitKey(key);
  const col = await getCollection(collection);

  const query = collection === "kv_store" ? { key } : collection === "users" ? { email: id } : { id };
  const document = await col.findOne(query);

  if (!document) {
    return null;
  }

  if (collection === "kv_store") {
    return document.value;
  }

  return document;
};

export const del = async (key: string): Promise<void> => {
  const { collection, id } = splitKey(key);
  const col = await getCollection(collection);
  const query = collection === "kv_store" ? { key } : collection === "users" ? { email: id } : { id };
  await col.deleteOne(query);
};

export const mset = async (keys: string[], values: any[]): Promise<void> => {
  await Promise.all(keys.map((key, index) => set(key, values[index])));
};

export const mget = async (keys: string[]): Promise<any[]> => {
  return Promise.all(keys.map((key) => get(key)));
};

export const mdel = async (keys: string[]): Promise<void> => {
  await Promise.all(keys.map((key) => del(key)));
};

export const getByPrefix = async (prefix: string): Promise<any[]> => {
  if (prefix === "user:") {
    const col = await getCollection("users");
    return await col.find({}).toArray();
  }

  if (prefix === "workshop:") {
    const col = await getCollection("workshops");
    return await col.find({}).toArray();
  }

  if (prefix === "booking:") {
    const col = await getCollection("bookings");
    return await col.find({}).toArray();
  }

  if (prefix === "payment:") {
    const col = await getCollection("payments");
    return await col.find({}).toArray();
  }

  const col = await getCollection("kv_store");
  const regex = new RegExp(`^${prefix}`);
  const docs = await col.find({ key: { $regex: regex } }).toArray();
  return docs.map((doc: any) => doc.value);
};

export const logEvent = async (event: any): Promise<void> => {
  const col = await getCollection("events");
  await col.insertOne({ ...event, timestamp: new Date() });
};

export const getEvents = async (): Promise<any[]> => {
  const col = await getCollection("events");
  return await col.find({}).sort({ timestamp: -1 }).toArray();
};
