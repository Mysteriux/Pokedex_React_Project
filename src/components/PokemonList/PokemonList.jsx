import axios from "axios";
import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";


function PokemonList(){

    const [isLoading,setIsLoading] = useState(true);
    const [pokemonList,setPokemonList] = useState([]);
    const [pokedex_url,setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    const [next_url,setNextUrl] = useState("");
    const [prev_url,setPrevUrl] = useState("");

    async function downloadPokemon(){
        setIsLoading(true);

        const response = await axios.get(pokedex_url); // this downloads list of 20 pokemons
        const pokemonResults = response.data.results; // we get the array of pokemons from result

        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);

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
    },[pokedex_url]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(isLoading) ? "Loading...." : 
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }
            </div>
            <div className="controls">
                <button disabled={prev_url == null} onClick={() => setPokedexUrl(prev_url)} >Prev</button>
                <button disabled={next_url == null} onClick={() => setPokedexUrl(next_url)} >Next</button>
            </div>
        </div>
    )
}

export default PokemonList;