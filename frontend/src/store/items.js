export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});

export const fetchPokemonItem = (pokemonId) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemonId}/items`);
  if (response.ok) {
    const items = await response.json();
    dispatch(load(items, pokemonId));
    return items;
  }
}

export const editPokemonItem = (payload) => async dispatch => {
  // /api/items/:id
  const response = await fetch(`/api/items/${parseInt(payload.id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const item = await response.json();
    dispatch(update(item));
    return item;
  }
}

export const addPokemonItem = (pokemonId, payload) => async dispatch => {
  // /api/pokemon/:pokemonId/items
  const response = await fetch(`/api/pokemon/${parseInt(pokemonId)}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const item = await response.json();
    dispatch(add(item));
    return item;
  }
}

export const deletePokemonItem = (pokemonId, itemId) => async dispatch => {
  // /api/items/:id
  const response = await fetch(`/api/items/${parseInt(itemId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const deletedItemId = await response.json();
    dispatch(remove(itemId, pokemonId));
    return deletedItemId;
  }
}

const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS:
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    case REMOVE_ITEM:
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    case ADD_ITEM:
    case UPDATE_ITEM:
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;
