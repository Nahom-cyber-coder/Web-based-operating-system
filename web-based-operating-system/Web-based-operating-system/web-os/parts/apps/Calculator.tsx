import React, { useState } from 'react';

const Calculator: React.FC = () => {
const [display, setDisplay] = useState('0');
const [previousValue, setPreviousValue] = useState<number | null>(null);
const [operation, setOperation] = useState<string | null>(null);
const [waitingForOperand, setWaitingForOperand] = useState(false);

const inputNumber = (num: string) => {
if (waitingForOperand) {
setDisplay(num);
setWaitingForOperand(false);
} else {
setDisplay(display === '0' ? num : display + num);
}
};

const inputDecimal = () => {
if (waitingForOperand) {
setDisplay('0.');
setWaitingForOperand(false);
} else if (display.indexOf('.') === -1) {
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

const calculate = (firstOperand: number, secondOperand: number, operation: string) => {
switch (operation) {
case '+':
return firstOperand + secondOperand;
case '-':
return firstOperand - secondOperand;
case '*':
return firstOperand * secondOperand;
case '/':
return firstOperand / secondOperand;
case '=':
return secondOperand;
default:
return secondOperand;
}
};

const handleOperation = (nextOperation: string) => {
if (nextOperation === '=') {
performOperation(nextOperation);
setOperation(null);
setPreviousValue(null);
setWaitingForOperand(true);
} else {
performOperation(nextOperation);
}
};

const Button: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ 
onClick, 
className = '', 
children 
}) => (
<button
onClick={onClick}
className={`h-16 text-lg font-medium rounded-lg transition-all duration-200 hover:scale-95 active:scale-90 ${className}`}
>
{children}
</button>
);

return (
<div className="h-full bg-gray-100 dark:bg-gray-900 p-4">
<div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
<div className="text-right text-white">
<div className="text-4xl font-light mb-2 truncate">{display}</div>
{operation && (
<div className="text-sm opacity-70">
{previousValue} {operation}
</div>
)}
</div>
</div>

<div className="p-4 grid grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-700">
<Button
onClick={clear}
className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
>
Clear
</Button>
<Button
onClick={() => handleOperation('/')}
className="bg-orange-500 hover:bg-orange-600 text-white"
>
÷
</Button>
<Button
onClick={() => handleOperation('*')}
className="bg-orange-500 hover:bg-orange-600 text-white"
>
×
</Button>

<Button
onClick={() => inputNumber('7')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
7
</Button>
<Button
onClick={() => inputNumber('8')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
8
</Button>
<Button
onClick={() => inputNumber('9')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
9
</Button>
<Button
onClick={() => handleOperation('-')}
className="bg-orange-500 hover:bg-orange-600 text-white"
>
-
</Button>

<Button
onClick={() => inputNumber('4')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
4
</Button>
<Button
onClick={() => inputNumber('5')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
5
</Button>
<Button
onClick={() => inputNumber('6')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
6
</Button>
<Button
onClick={() => handleOperation('+')}
className="bg-orange-500 hover:bg-orange-600 text-white"
>
+
</Button>

<Button
onClick={() => inputNumber('1')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
1
</Button>
<Button
onClick={() => inputNumber('2')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
2
</Button>
<Button
onClick={() => inputNumber('3')}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
3
</Button>
<Button
onClick={() => handleOperation('=')}
className="row-span-2 bg-green-500 hover:bg-green-600 text-white"
>
=
</Button>

<Button
onClick={() => inputNumber('0')}
className="col-span-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
0
</Button>
<Button
onClick={inputDecimal}
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
>
.
</Button>
</div>
</div>
</div>
);
};

export default Calculator;