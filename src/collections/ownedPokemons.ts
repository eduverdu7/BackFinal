import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";

const rand = () => Math.floor(Math.random() * 100) + 1;

export const catchPokemon = async (
  pokemonId: string,
  nickname: string | null,
  trainerId: string
) => {
  const db = getDB();

  const res = await db.collection("ownedPokemons").insertOne({
    trainerId: new ObjectId(trainerId),
    pokemonId: new ObjectId(pokemonId),
    nickname,
    attack: rand(),
    defense: rand(),
    speed: rand(),
    special: rand(),
    level: rand()
  });

  return db
    .collection("ownedPokemons")
    .findOne({ _id: res.insertedId });
};

export const freePokemon = async (
  ownedPokemonId: string,
  trainerId: string
) => {
  const db = getDB();
  const ownedId = new ObjectId(ownedPokemonId);

  const owned = await db
    .collection("ownedPokemons")
    .findOne({ _id: ownedId });

  if (!owned || owned.trainerId.toString() !== trainerId)
    throw new Error("Not allowed");

  await db.collection("ownedPokemons").deleteOne({ _id: ownedId });

  return owned;
};
