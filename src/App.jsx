import './App.css'
import {useReducer} from "react";
import DigitButton from "./DigitButton.jsx";
import OperationButton from "./OperationButton.jsx";


export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {

    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (payload.digit === "0" && state.currentOperand === "0") return state;
            if (payload.digit === "." && state.currentOperand.includes(".")) return state;
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) return state;
            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                }
            }

            return {
                ...state,
                operation: payload.operation,
                previousOperand: evaluate(state),
                currentOperand: null
            }
        case ACTIONS.CLEAR:
            return {};
        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state;
            return {
                ...state,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)
            }
        case ACTIONS.DELETE_DIGIT:
            return {}
    }
}

function evaluate({previousOperand, currentOperand, operation}) {
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(curr)) return "";
    let computation = "";
    switch (operation) {
        case '+':
            computation = prev + curr;
            break;
        case '-':
            computation = prev - curr;
            break;
        case '*':
            computation = prev * curr;
            break;
        case '%':
            computation = prev % curr;
            break;
    }
    return computation;
}

function App() {


    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});


    return (
        <div className="App">
            <div className="calculator-grid">
                <div className="output">
                    <div className="previous-operand">{previousOperand} {operation}</div>
                    <div className="current-operand">{currentOperand}</div>
                </div>
                <button className="span-two" onClick={() =>
                    dispatch({type: ACTIONS.CLEAR})
                }>
                    AC
                </button>
                <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>

                <OperationButton operation="%" dispatch={dispatch}/>
                <DigitButton dispatch={dispatch} digit="1"/>
                <DigitButton dispatch={dispatch} digit="2"/>
                <DigitButton dispatch={dispatch} digit="3"/>
                <OperationButton operation="*" dispatch={dispatch}/>
                <DigitButton dispatch={dispatch} digit="4"/>
                <DigitButton dispatch={dispatch} digit="5"/>
                <DigitButton dispatch={dispatch} digit="6"/>
                <OperationButton operation="+" dispatch={dispatch}/>
                <DigitButton dispatch={dispatch} digit="7"/>
                <DigitButton dispatch={dispatch} digit="8"/>
                <DigitButton dispatch={dispatch} digit="9"/>
                <OperationButton operation="-" dispatch={dispatch}/>
                <DigitButton dispatch={dispatch} digit="."/>
                <DigitButton dispatch={dispatch} digit="0"/>
                {/*<button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className="span-two">=</button>*/}
                <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className="span-two">=</button>

            </div>
        </div>
    )
}

export default App
