import { IResolvers } from "@graphql-tools/utils";
import { getPokemons, getPokemonById, createPokemon } from "../collections/pokemons";
import { startJourney, loginTrainer } from "../collections/trainers";
import { catchPokemon, freePokemon } from "../collections/ownedPokemons";
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { COLLECTION_OWNED, COLLECTION_POKEMONS } from "../utils";

export const resolvers: IResolvers = {
  Query: {
    me: (_: any, __: any, { user }: any) => user ?? null,

    pokemons: (_: any, { page, size }: any) =>
      getPokemons(page, size),

    pokemon: (_: any, { id }: any) =>
      getPokemonById(id)
  },
  
  Mutation: {
    startJourney: async (_: any, { name, password }: any) =>
      signToken(await startJourney(name, password)),

    login: async (_: any, { name, password }: any) => {
      const trainer = await loginTrainer(name, password);
      if (!trainer) throw new Error("Invalid credentials");
      return signToken(trainer._id.toString());
    },

    createPokemon: async (_: any, args: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return createPokemon(
        args.name,
        args.description,
        args.height,
        args.weight,
        args.types
      );
    },

    catchPokemon: async (_: any, { pokemonId, nickname }: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return catchPokemon(pokemonId, nickname, user._id.toString());
    },

    freePokemon: async (_: any, { ownedPokemonId }: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return freePokemon(ownedPokemonId, user._id.toString());
    }
  },

  Trainer: {
    pokemons: async (parent: any) => {
      if (!parent.pokemons || parent.pokemons.length === 0) return [];
      const db = getDB();
      const ids = parent.pokemons.map((id: string) => new ObjectId(id));
      return db
        .collection(COLLECTION_OWNED)
        .find({ _id: { $in: ids } })
        .toArray();
    }
  },

  OwnedPokemon: {
    pokemon: async (parent: any) => {
      const db = getDB();
      return db
        .collection(COLLECTION_POKEMONS)
        .findOne({ _id: new ObjectId(parent.pokemonId) });
    }
  }
};
