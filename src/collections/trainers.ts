import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDB } from "../db/mongo";

export const startJourney = async (name: string, password: string) => {
  const db = getDB();

  if (await db.collection("trainers").findOne({ name }))
    throw new Error("Trainer already exists");

  const hash = await bcrypt.hash(password, 10);

  const res = await db.collection("trainers").insertOne({
    name,
    password: hash,
    pokemons: []
  });

  return res.insertedId.toString();
};

export const loginTrainer = async (name: string, password: string) => {
  const db = getDB();
  const trainer = await db.collection("trainers").findOne({ name });
  if (!trainer) return null;

  const ok = await bcrypt.compare(password, trainer.password);
  if (!ok) return null;

  return trainer;
};
