import axios from "axios";
import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";


function PokemonList(){

    const [pokemonListState,SetPokemonListState] = useState({
        isLoading: true,
        pokemonList: [],
        pokedex_url: "https://pokeapi.co/api/v2/pokemon",
        next_url: "",
        prev_url: ""
    });
    // const [isLoading,setIsLoading] = useState(true);
    // const [pokemonList,setPokemonList] = useState([]);
    // const [pokedex_url,setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    // const [next_url,setNextUrl] = useState("");
    // const [prev_url,setPrevUrl] = useState("");

    async function downloadPokemon(){
        // setIsLoading(true);
        SetPokemonListState((state) => ({...pokemonListState, isLoading: true}));

        const response = await axios.get(pokemonListState.pokedex_url); // this downloads list of 20 pokemons
        const pokemonResults = response.data.results; // we get the array of pokemons from result

        // setNextUrl(response.data.next);
        // setPrevUrl(response.data.previous);
        SetPokemonListState((state) => ({
            ...state,
            next_url: response.data.next,
            prev_url: response.data.previous,
            isLoading: false
        }));

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
        // setPokemonList(res);
        // setIsLoading(false);
        SetPokemonListState((state) => ({
            ...state,
            pokemonList: res,
            isLoading: false
        }));
    }

    useEffect(() => {
        downloadPokemon();
    },[pokemonListState.pokedex_url]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(pokemonListState.isLoading) ? "Loading...." : 
                    pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }
            </div>
            <div className="controls">
                <button disabled={pokemonListState.prev_url == null} onClick={() => {
                    const setToURL = pokemonListState.prev_url;
                    SetPokemonListState({...pokemonListState,pokedex_url: setToURL});
                }} >Prev</button>
                <button disabled={pokemonListState.next_url == null} onClick={() => {
                    const setToURL = pokemonListState.next_url;
                    SetPokemonListState({...pokemonListState,pokedex_url: setToURL});
                }} >Next</button>
            </div>
        </div>
    )
}

export default PokemonList;