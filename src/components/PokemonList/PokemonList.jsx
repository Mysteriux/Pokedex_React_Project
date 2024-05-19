import axios from "axios";
import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";


function PokemonList(){

    const [isLoading,setIsLoading] = useState(true);
    const [pokemonList,setPokemonList] = useState([]);
    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon";

    async function downloadPokemon(){
        const response = await axios.get(POKEDEX_URL); // this downloads list of 20 pokemons
        const pokemonResults = response.data.results; // we get the array of pokemons from result

        // terating over the array of pokemons and using their urls to create an array of promises
        // that will download those 20 pokemons
        const pokemonPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonPromise); //array of 20 pokemon detailed data
        console.log(pokemonData);

        // now iterate om the data of each pokemon and extract id, name, image, types,
        const res = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name, 
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny, 
                types: pokemon.types
            }
        });
        console.log(res);
        setPokemonList(res);
        setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemon();
    },[]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(isLoading) ? "Loading...." : 
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
                }
            </div>
            <div className="controls">
                <button>prev</button>
                <button>next</button>
            </div>
        </div>
    )
}

export default PokemonList;