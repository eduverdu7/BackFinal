import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";

export const createPokemon = async (
  name: string,
  description: string,
  height: number,
  weight: number,
  types: string[]
) => {
  const res = await getDB().collection("pokemons").insertOne({
    name,
    description,
    height,
    weight,
    types
  });
  return { _id: res.insertedId, name, description, height, weight, types };
};

export const getPokemons = async (page = 1, size = 10) =>
  getDB()
    .collection("pokemons")
    .find()
    .skip((page - 1) * size)
    .limit(size)
    .toArray();

export const getPokemonById = async (id: string | ObjectId) =>
  getDB()
    .collection("pokemons")
    .findOne({ _id: new ObjectId(id) });
