import { describe, it, expect } from 'vitest';

const initialState = { items: [], total: 0 };

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += 1;
        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

describe('PruebaJasmine - Pruebas del Carrito', () => {
  it('debería agregar un juego al carrito correctamente', () => {
    const producto = { id: 101, name: 'Cyberpunk Game', price: 29990 };
    const action = { type: 'ADD_ITEM', payload: producto };
    const newState = cartReducer(initialState, action);

    expect(newState.items.length).toBe(1);
    expect(newState.items[0].quantity).toBe(1);
    expect(newState.total).toBe(29990);
  });

  it('debería acumular la cantidad si el producto ya existe', () => {
    const producto = { id: 101, name: 'Cyberpunk Game', price: 29990 };
    const statePrevio = {
      items: [{ ...producto, quantity: 1 }],
      total: 29990
    };
    const action = { type: 'ADD_ITEM', payload: producto };
    const newState = cartReducer(statePrevio, action);

    expect(newState.items.length).toBe(1);
    expect(newState.items[0].quantity).toBe(2);
    expect(newState.total).toBe(59980);
  });
});