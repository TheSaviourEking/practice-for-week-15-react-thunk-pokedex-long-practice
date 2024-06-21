import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';

const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';

const load = list => ({
  type: LOAD,
  list
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon
});

export const getAPokemon = id => async dispatch => {
  const response = await fetch(`/api/pokemon/${parseInt(id)}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(addOnePokemon(data));
  }
}

export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

export const createAPokemon = payload => async dispatch => {
  try {
    const response = await fetch('/api/pokemon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const pokemon = await response.json();
      dispatch(addOnePokemon(pokemon));
      return pokemon;
    } else {
      if (response.status === 422) {
        const errorData = await response.json();
        const error = new Error(errorData.title);
        error.errors = errorData.errors;
        throw error;
      }
    }
  } catch (error) {
    if (!error.data) {
      error.data = { title: error.message, errors: { general: 'An unexpected error occurred' } };
    }
    throw error;
  }
}

export const editAPokemon = payload => async dispatch => {
  const response = await fetch(`/api/pokemon/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
    return pokemon;
  }
}

const initialState = {
  list: [],
  types: []
};

const sortList = (list) => {
  return list.sort((pokemonA, pokemonB) => {
    return pokemonA.number - pokemonB.number;
  }).map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allPokemon = {};
      action.list.forEach(pokemon => {
        allPokemon[pokemon.id] = pokemon;
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list)
      };
    case LOAD_TYPES:
      return {
        ...state,
        types: action.types
      };
    case ADD_ONE:
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: action.pokemon
        };
        const pokemonList = newState.list.map(id => newState[id]);
        pokemonList.push(action.pokemon);
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...action.pokemon
        }
      };
    case LOAD_ITEMS:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map(item => item.id)
        }
      };
    case REMOVE_ITEM:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].items.filter(
            (itemId) => itemId !== action.itemId
          )
        }
      };
    // case ADD_ITEM:
    //   return {
    //     ...state,
    //     [action.item.pokemonId]: {
    //       ...state[action.item.pokemonId],
    //       items: [...state[action.item.pokemonId].items, action.item.id]
    //     }
    //   };
    case ADD_ITEM:
      const { pokemonId, id } = action.item;
      return {
        ...state,
        [pokemonId]: {
          ...state[pokemonId],
          items: state[pokemonId].items.includes(id) ? state[pokemonId].items : [...state[pokemonId].items, id]
        }
      };
    default:
      return state;
  }
}

export default pokemonReducer;
