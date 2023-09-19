import { useReducer } from "react"; // React'tan useReducer'ı içe aktarıyoruz.
import DigitButton from "./DigitButton"; // Sayı tuşlarını temsil eden bileşeni içe aktarıyoruz.
import OperationButton from "./OperationButton"; // İşlem tuşlarını temsil eden bileşeni içe aktarıyoruz.
import "./styles.css"; // Stil dosyasını içe aktarıyoruz.
import Decimal from "decimal.js"; // Decimal işlemleri için Decimal.js kütüphanesini içe aktarıyoruz.

// Eylem tiplerini sabitlerle temsil etmek için kullanılan nesne
export const ACTION_TYPES = {
  ADD_DIGIT: "add-digit", // Sayı eklemek için kullanılır
  CHOOSE_OPERATION: "choose-operation", // İşlem seçmek için kullanılır
  CLEAR: "clear", // Temizleme işlemi
  DELETE_DIGIT: "delete-digit", // Sayıyı silme işlemi
  EVALUATE: "evaluate", // Hesaplama işlemi
};

// Reducer işlevi: Eylemlere yanıt olarak yeni durumu hesaplar
function calculatorReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_DIGIT: // Sayı tuşuna basıldığında
      if (state.isOverwriting) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          isOverwriting: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (action.payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };
    case ACTION_TYPES.CHOOSE_OPERATION: // İşlem tuşuna basıldığında
      if (state.operation != null) {
        return {
          ...state,
          operation: action.payload.operation,
          isOverwriting: true,
        };
      } else {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
          isOverwriting: true,
        };
      }
    case ACTION_TYPES.CLEAR: // Temizleme tuşuna basıldığında
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
        isOverwriting: false,
      };
    case ACTION_TYPES.DELETE_DIGIT: // Silme tuşuna basıldığında
      if (state.isOverwriting) {
        return {
          ...state,
          isOverwriting: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTION_TYPES.SQUARE: // Kare alma tuşuna basıldığında
      if (state.currentOperand == null) return state;
      const decimal_0_1 = new Decimal(state.currentOperand);
      const squaredValue = decimal_0_1.pow(2).toString();
      return {
        ...state,
        currentOperand: squaredValue,
        isOverwriting: true,
      };
    case ACTION_TYPES.EVALUATE: // Hesaplama tuşuna basıldığında
      if (state.operation != null) {
        const prev = parseFloat(state.previousOperand);
        const current = parseFloat(state.currentOperand);
        let result = "";
        switch (state.operation) {
          case "+":
            result = (prev + current).toString();
            break;
          case "-":
            result = (prev - current).toString();
            break;
          case "*":
            result = (prev * current).toString();
            break;
          case "÷":
            if (current === 0) {
              result = "Error";
            } else {
              result = (prev / current).toString();
            }
            break;
          default:
            result = "";
        }
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: result,
          isOverwriting: true,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

// Sayıyı biçimlendiren yardımcı işlev
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

// Ana uygulama bileşeni
function CalculatorApp() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    calculatorReducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION_TYPES.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION_TYPES.DELETE_DIGIT })}>
        DEL
      </button>
      <button onClick={() => dispatch({ type: ACTION_TYPES.SQUARE })}>
        x²
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="equal-button"
        onClick={() => dispatch({ type: ACTION_TYPES.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default CalculatorApp;
