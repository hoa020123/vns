import React, { useState } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  };

  const handlePlusMinus = () => {
    const currentValue = parseFloat(display);
    const newValue = -currentValue;
    setDisplay(String(newValue));
  };

  return (
    <div className="calculator-container">
      <h2>🧮 Máy tính</h2>
      
      <div className="calculator">
        <div className="calculator-display">
          <div className="calculator-expression">
            {previousValue !== null && operation && `${previousValue} ${operation}`}
          </div>
          <div className="calculator-value">{display}</div>
        </div>
        
        <div className="calculator-keypad">
          <div className="calculator-row">
            <button className="calc-btn calc-btn-function" onClick={clear}>
              AC
            </button>
            <button className="calc-btn calc-btn-function" onClick={handlePlusMinus}>
              ±
            </button>
            <button className="calc-btn calc-btn-function" onClick={handlePercent}>
              %
            </button>
            <button 
              className={`calc-btn calc-btn-operator ${operation === '÷' ? 'active' : ''}`}
              onClick={() => performOperation('÷')}
            >
              ÷
            </button>
          </div>
          
          <div className="calculator-row">
            <button className="calc-btn" onClick={() => inputDigit('7')}>7</button>
            <button className="calc-btn" onClick={() => inputDigit('8')}>8</button>
            <button className="calc-btn" onClick={() => inputDigit('9')}>9</button>
            <button 
              className={`calc-btn calc-btn-operator ${operation === '×' ? 'active' : ''}`}
              onClick={() => performOperation('×')}
            >
              ×
            </button>
          </div>
          
          <div className="calculator-row">
            <button className="calc-btn" onClick={() => inputDigit('4')}>4</button>
            <button className="calc-btn" onClick={() => inputDigit('5')}>5</button>
            <button className="calc-btn" onClick={() => inputDigit('6')}>6</button>
            <button 
              className={`calc-btn calc-btn-operator ${operation === '-' ? 'active' : ''}`}
              onClick={() => performOperation('-')}
            >
              -
            </button>
          </div>
          
          <div className="calculator-row">
            <button className="calc-btn" onClick={() => inputDigit('1')}>1</button>
            <button className="calc-btn" onClick={() => inputDigit('2')}>2</button>
            <button className="calc-btn" onClick={() => inputDigit('3')}>3</button>
            <button 
              className={`calc-btn calc-btn-operator ${operation === '+' ? 'active' : ''}`}
              onClick={() => performOperation('+')}
            >
              +
            </button>
          </div>
          
          <div className="calculator-row">
            <button className="calc-btn calc-btn-zero" onClick={() => inputDigit('0')}>
              0
            </button>
            <button className="calc-btn" onClick={inputDecimal}>.</button>
            <button className="calc-btn calc-btn-equals" onClick={handleEquals}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 