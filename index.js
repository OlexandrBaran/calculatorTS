

//-------------------------------------------------------------
// Math operations
var add = function (a, b) { return a + b; };
var subtract = function (a, b) { return a - b; };
var divide = function (a, b) { return a / b; };
var multiply = function (a, b) { return a * b; };
var numberPower2 = function (a) { return Math.pow(a, 2); };
var numberPower3 = function (a, b) { return a * b; };
var numberPowerNumber = function (a, b) { return a * b; };
var sqrtNumber = function (a, b) { return a * b; };
var oneDivideNumber =  function (a, b) { return a * b; };
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
    '1/x': oneDivideNumber
};

var displayShouldClear; //boolean chi maye zmin ekran
var currentOperator; //String potochniy operator
var currentTotal;//potpschniy resultat
var lastOperator;

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



            // We handle null/-0 the same, replace them with the number pressed
    if (display.value === '' || isNegativeZero) {
        display.value = isNegativeZero ? '-' + btnValue : btnValue;
              
                return;
    }
            
            display.value += btnValue
            
            return;
    
}

const removeHangingDecimal = () => {
    if (display.value.indexOf('.') === display.value.length) {
        display.value = display.value.slice(0, display.value.length - 1);
    }
};

const clear = () => {
    display.value = '';

}

const evaluate = () => {
    
    // No operator? Can't evaluate
    if (currentOperator && lastOperator)
            return;

    removeHangingDecimal();
    let leftNum, rightNum, operation;

        
   
            leftNum = currentTotal;
            rightNum = parseFloat(display.value);
           operation = operations[currentOperator || lastOperator];
     
    let result = parseFloat(operation( leftNum, rightNum).toFixed(3));
        currentTotal = null;
        display.value = result.toString();
        displayShouldClear = true;

    return result;
       
}

const dotPressed = () => {
    if (typeof display.value === 'string' && !display.value.includes('.') && display.value.length > 0 && !displayShouldClear) {
        display.value += '.';
        //solve 0.1 + 0.2 = 0.30000000000004 problem
    }
    else if (displayShouldClear || display.value === '') {
        display.value += '0.'
        
        displayShouldClear = false;
    }
}

const switchPolarity = () => {
    if (currentOperator && display.value) {
        currentTotal = parseFloat(display.value);
    }
    if (display.value || (display.value && currentOperator)) {
        display.value = "0";
    }
    if (display.value.substr(0, 1) === '-') {
        display.value = display.value.substr(1, display.value.length);
    }
    else {
        display.value = '-' + display.value;
    }
    displayShouldClear = false;
   
}


const operatorPressed = (btnValue) => {
    switch (btnValue) {
        case '=':
           evaluate();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case 'x2':
        case 'x3':
        case 'xY':
        case 'sqrtX':
        case '1/x':
            currentOperator = btnValue;
            displayShouldClear = false;
            break;
        case 'clearAll':
            clear();
            break;
        case '.':
            dotPressed();
            break;
        case 'switchPolarity':
            switchPolarity();
            break;
        default:
            throw new Error('clicked wrong operator');
    }
}


const specialPanelAction = () => {
    let specialBtnSections = document.querySelectorAll('.specialBtn-section');
    specialBtnSections.forEach( section => {
        if(section.getAttribute('style') === 'display: flex')
            section.setAttribute('style', 'display: none');
        else
            section.setAttribute('style', 'display: flex');
    })
}



//init function launched when app started
function init() {

    var display = document.getElementById('display');
   
    let calcBtns = document.querySelectorAll('.btn');

    const displayUpdate = (btnValue) => {
        if (btnValue !== 'showPanel'){}
;
        
    }

    
    calcBtns.forEach( btn => btn.addEventListener('click', (e) => {
        let btnValue = e.target.getAttribute("data-value");
        let btnType = e.target.getAttribute("data-type");
        displayUpdate(btnValue)
        buttonPressed({ btnValue, btnType})
    }) )
}
//EventListener launch when app is started(DOM loaded)
document.addEventListener('DOMContentLoaded', init);