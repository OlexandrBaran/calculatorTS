// basic variables
var displayShouldClear; 
var currentOperator; 
var currentTotal;
var lastOperator;
var historyArr = [];
var historyClc = 0;

// Math operations
var add = (a, b) => a + b;
var subtract = (a, b) => a - b;
var divide = (a, b) =>  a / b; 
var multiply = (a, b) =>  a * b;
var numberPower2 = a =>  Math.pow(a, 2); 
var numberPower3 = a =>  Math.pow(a, 3);
var numberPowerNumber = (a, b) => Math.pow(a, b); 
var sqrtNumber = a => Math.sqrt(a);
var root3 = a => Math.cbrt(a);
var rootNumber = (a, b) => Math.pow(a, 1/b);
var oneDivideNumber = a => 1/a;

// map symbols to math operations
var operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
    'x2': numberPower2,
    'x3': numberPower3,
    'xY': numberPowerNumber,
    'sqrtX': sqrtNumber,
    'root3': root3,
    'rootY':rootNumber,
    '1/x': oneDivideNumber
};


//handle event when btn pressed
const buttonPressed = ({btnValue, btnType}) => {
    switch (btnType) {
        case 'number':
            numberPressed(btnValue);
            break;
        case 'operator':
            operatorPressed(btnValue);
            break;
        case 'specialPanelAction':
            specialPanelAction();
            break;
        default:
            throw new Error('Button type not recognized!');   
        }
    return;
}

//number pressed functions
const numberPressed = (btnValue) => {       
   var isNegativeZero = display.value === '-0';

   if (displayShouldClear) {
        clear();
        displayShouldClear = false;
    }

    if (currentOperator && display.value  && !isNegativeZero) {
        removeHangingDecimal()
        
        if (currentTotal) {
            let operation = operations[currentOperator];
            currentTotal = operation(currentTotal, parseFloat(display.value));
        }
        else {
            currentTotal = parseFloat(display.value);
        }
        
        display.value = '';
        lastOperator = currentOperator;
        currentOperator = null;
    }
    
    if (display.value === '' || isNegativeZero) {
        display.value = isNegativeZero ? '-' + btnValue : btnValue;              
        return;
    }    

    if (display.value === '0' && btnValue === '0') {
        return;
      }
    
    display.value += btnValue;      
    return;
}

//remove last dot
const removeHangingDecimal = () => {
    if (display.value.indexOf('.') === display.value.length) {
        display.value = display.value.slice(0, display.value.length - 1);
    }
};

//clear display fucktion
const clear = () => {
    display.value = '';
    currentTotal = null;
    currentOperator = null;
    lastOperator = null;
    displayShouldClear = true;
}

//backspase function (clear one element from display)
const clearOne = () => {
    display.value = display.value.slice(0, display.value.length - 1);
}

// = 
const evaluate = () => {
    // No operator
    if (currentOperator && lastOperator)
            return;

    removeHangingDecimal();
    let leftNum, rightNum, operation;
    
    if (displayShouldClear) { 
        const latestOperation = historyArr[0];
        leftNum =  parseFloat(display.value);
        rightNum = latestOperation.rightNum;
        operation = latestOperation.operation;
        return;
      } else {
        leftNum = currentTotal;
        rightNum = parseFloat(display.value);
        operation = operations[currentOperator || lastOperator];
      }

    let result = parseFloat(operation(leftNum, rightNum).toFixed(6));
        currentTotal = null;
        display.value = result.toString();
        displayShouldClear = true;
    historyArr.unshift({
        operation:operation,
        rightNum: rightNum,
        leftNum: leftNum,
        result:result
    });
    return result;
       
}

//show history by clicking btn H
const showHistory = (historyClics) => {
    if(historyClc < historyArr.length + 1)
        display.value = historyArr[historyClics-1].result;
    else
        display.value = '';
}

// funk when dot pressed
const dotPressed = () => {
    if (typeof display.value === 'string' && !display.value.includes('.') && display.value.length > 0 && !displayShouldClear) {
        display.value += '.';
    }
    else if (displayShouldClear || display.value === '') {
        display.value += '0.'
        displayShouldClear = false;
    }
}

//switch + -
const switchPolarity = () => {
    if (currentOperator && display.value) {
        currentTotal = parseFloat(display.value);
    }

    if (display.value.substr(0, 1) === '-') {
        display.value = display.value.substr(1, display.value.length);
    }
    else {
        display.value = '-' + display.value;
    }
    displayShouldClear = false;
}

//func for operations that have work with one value
const specialBtnMathOperation = () => {
    let parsedNum = parseFloat(display.value);
    let operation = operations[currentOperator];
     
    let result = parseFloat(operation(parsedNum).toFixed(6));
        currentTotal = null;
        display.value = result.toString();
        displayShouldClear = true;

    return result;
}

//operators press function
const operatorPressed = (btnValue) => {   
    switch (btnValue) {
        case '=':
           evaluate();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case 'xY':
        case 'rootY':
            currentOperator = btnValue;
            displayShouldClear = false;
            break;
        case 'x2':
        case 'x3':
        case 'sqrtX':
        case 'root3':
        case '1/x':
            currentOperator = btnValue;
            specialBtnMathOperation();
            break;
        case 'clearAll':
            clear();
            break;
        case 'clearOne':
            clearOne();
            break;
        case '.':
            dotPressed();
            break;
        case 'switchPolarity':
            switchPolarity();
            break;
        case 'history':
            showHistory(++historyClc);
            break;
        default:
            throw new Error('clicked wrong operator');
    }
}

//func for showing and hide special btns
const specialPanelAction = () => {
    let specialBtnSections = document.querySelectorAll('.specialBtn-section');
    specialBtnSections.forEach( section => {
        if(section.getAttribute('style') === 'display: flex')
            section.setAttribute('style', 'display: none');
        else
            section.setAttribute('style', 'display: flex');
    })
}

const onKeyPress = (event) => {
    console.log(event)
    let btnValue, btnType;
    btnValue = event.key;
    switch (btnValue) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            btnType = 'number';
            buttonPressed({ btnValue, btnType});
            break;
        case '.':
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            btnType = 'operator';
            buttonPressed({ btnValue, btnType});
            break;
        case 'Enter':
            btnType = 'operator';
            btnValue = '=';
            buttonPressed({ btnValue, btnType});
            break;
        case 'Backspace':
            clearOne();
            break;
        default:
            break;
    }
}

//init function launched when app started
function init() {

    var display = document.getElementById('display');
    let calcBtns = document.querySelectorAll('.btn');

    calcBtns.forEach( btn => btn.addEventListener('click', (e) => {
        let btnValue = e.target.getAttribute("data-value");
        let btnType = e.target.getAttribute("data-type");
        buttonPressed({ btnValue, btnType})
    }) );

    document.addEventListener('keypress', (event) => {
        onKeyPress(event);
    });

}
//EventListener launch when app is started(DOM loaded)
document.addEventListener('DOMContentLoaded', init);