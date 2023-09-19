import { ACTION_TYPES } from "./App";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({
          type: ACTION_TYPES.CHOOSE_OPERATION,
          payload: { operation },
        })
      }
    >
      {operation}
    </button>
  );
}
