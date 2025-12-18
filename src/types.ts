import { ObjectId } from "mongodb";

export interface Trainer {
  _id: ObjectId;
  name: string;
  pokemons: ObjectId[];
}
