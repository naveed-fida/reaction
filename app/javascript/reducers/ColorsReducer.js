export default function colorsReducer(state = { colorblind: false }, action) {
  if (action.type === 'TOGGLE_COLORBLIND') {
    return {
      ...state,
      colorblind: !state.colorblind
    };
  } else {
    return state;
  }
}
