import { ACTION_TYPES } from "./App";

export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTION_TYPES.ADD_DIGIT, payload: { digit } })
      }
    >
      {digit}
    </button>
  );
}
