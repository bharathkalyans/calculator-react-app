import './App.css'
import {useReducer} from "react";
import DigitButton from "./DigitButton.jsx";
import OperationButton from "./OperationButton.jsx";

import {ACTIONS} from "./reducerActions.js";

import {evaluate} from "./utils.js"

function reducer(state, {type, payload}) {

    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                }
            }
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
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)
            }
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                };
            }
            if (state.currentOperand == null) return state;
            if (state.currentOperand.length === 1) return {
                ...state,
                currentOperand: null
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
    }
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

                <OperationButton operation="÷" dispatch={dispatch}/>
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
                <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className="span-two">=</button>

            </div>
        </div>
    )
}

export default App
