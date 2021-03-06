
const buttonElements = document.getElementsByClassName("calc-button");
const quickMathSwitch = document.getElementById('math-switch');
const display = document.getElementById('display')
const calculator = document.getElementById('calculator')
const background = document.getElementById("background");

const instrumental = new Audio("/audio/instrumental.mp3")
let quickMathAudio = []


/*
 Kallar på init först så allt är klart för att användas.
 */
init()

/*
initialiserar
 */
function init () {

    /*
    Itererar och lägger till onInput() när man trycker på knapparna, här skickar jag med knappens värde.
     */
    for(const button of buttonElements) {
        button.addEventListener('click', event => {
            onInput(button.value)
        })
    }

    for(let i = 0; i < 61; i++) {
        quickMathAudio[i] = new Audio(`/audio/quickmath/${i+1}.mp3`)
    }

    instrumental.volume = .2
    instrumental.loop = true;
    instrumental.fastSeek(14.2)

}

/*
    Hämtar prioriteten för pemdas
 */
function getPriority(op) {
    switch (op) {
        case '(': return 0;
        case '-':
        case '+': return 1;
        case '/':
        case '*': return 2;
    }
}

/*
    parsar inputen
 */
function parseResult(inp) {
    let result = []

    let fullNum = "";

    for(let i = 0; i < inp.length; i++) {

        let symbol = inp[i];

        if(isNumberCharacter(symbol)) {
            fullNum += symbol;
        } else {
            if(fullNum.length > 0)
                result.push(fullNum);
            result.push(symbol);
            fullNum = "";
        }
    }

    result.push(fullNum)

    return result;
}

/*
    Omvandlar inputen till ett postfix för att kunna hantera pemdas
 */
function calculate(inp) {
    result = parseResult(inp);

    let stack = []
    let postfix = []

    for(const symbol of result) {

        if(isNumber2(symbol)) {
            postfix.push(symbol)
        } else if(symbol === '(') {
            stack.push(symbol)
        } else if(symbol === ')') {

            for(let i = 0; i < stack.length; i++) {

                let inStack = stack.pop();

                if(inStack === '(')
                    break;

                postfix.push(inStack)

            }
        } else {
            for(let i = 0; i < stack.length; i++) {
                if(getPriority(stack[stack.length - 1]) >= getPriority(symbol))
                    postfix.push(stack.pop());
                else
                    break;
            }
            stack.push(symbol);

        }
    }

    for(let i = 0; i <= stack.length; i++) {
        postfix.push(stack.pop())
    }

    calculatePostFix(postfix);
}

/*
    Beräknar det givna uttrycket
 */
function calculateExpression(num1, num2, op) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    switch(op) {
        case '-': return num1 - num2;
        case '+': return num1 + num2;
        case '/': return num1 / num2;
        case '*': return num1 * num2;
    }
}

/*
    Visar resultatet
 */
function validateResult(pop) {

    if(isNumber(pop)) {
        display.value = pop;
    } else {
        display.value = "error";
    }
}

/*
    Beräknar postfixet
 */
function calculatePostFix(postfix) {
    let stack = [];

    for(let i = 0; i < postfix.length ; i++) {
        const symbol = postfix[i];

        if(isNumber2(symbol)) {
            stack.push(symbol)
        } else {
            const num2 = stack.pop();
            const num1 = stack.pop();
            const op = symbol;
            const result = calculateExpression(num1, num2, op)
            stack.push(result);
        }

    }

    if(stack.length === 2)
        stack.push(calculateExpression(stack.pop(), stack.pop(), "+"))


    const result = stack.pop();

    validateResult(result);
}


/*
Kollar om inmatningen är en operatör.
 */
function isOperator(op) {
    let isop = /[/*+-]/.test(op);
    //console.log("op: " + isop + ">" + op + "<");
    return isop;
}

/*
Kollar om inmatning är ett nummer.
 */
function isNumber(val) {
    return /\d/.test(val);
}

function isNumber2(val) {
    return /^\d*(\.\d+)?$/.test(val);
}

/*
    kollar om det
 */
function isNumberCharacter(val) {
    return isNumber(val) || val === '.';
}

/*
Hämtar senaste karaktären i input-displayen.
 */
function getLastInput() {
    return display.value.slice(-1);
}


/*
 Kollar om det är tomt i display rutan.
 */
function isEmpty() {
    let empty = display.value.length === 0;
    return empty;
}


/*
    Tar bort senaste inputen
 */
function removeLast() {
    display.value = display.value.slice(0, -1);
}


/*
    kollar om det går att beräkna uttrycket.
 */
function canCalculate() {
    return parseResult(display.value).length >= 3;
}

/*
Hanterar inmatning.
 */
function onInput(val) {

    if(display.value === "error") {
        reset()
    }

    if(val === 'C') { //Återställer miniräknaren.
        reset()
    } else if(val === 'CE') { //Tar bort sista karaktären.
        removeLast()
    } else if(val === '=') { //beräknar resultatet.
        if(canCalculate())
            calculate(display.value);
    } else if(canInput(val)) {//lägger till händelsen i minnet efter kontroll.
        display.value += val;
    }

    if(quickMathSwitch.checked) {
        playRandomSound()
    }

}


function playRandomSound() {
    const index = Math.floor(Math.random() * quickMathAudio.length);
    console.log("Playing index: " + index + " (" + (index + 1) + ".mp3)")
    quickMathAudio[index].play();
}

/*
Hindrar att man slår in flera operatörer i rad eller att man börjar med en operatör.
 */
function canInput(inp) {
    return !(isOperator(inp) && (isOperator(getLastInput()) || isEmpty()));
}


/*
Återställer miniräknaren.
 */
function reset () {
    display.value = "";
}

function spinButtons(spin = true) {

    for(let button of buttonElements) {
        if(spin)
            button.style.cssText = 'animation: numRotate 2.5s linear infinite'
        else
            button.style.cssText = 'animation: none'
    }

}

function toggleQuickMath() {
    const on = quickMathSwitch.checked;

    if(on) {
        instrumental.loop
        instrumental.play();
        calculator.classList.add('big-shaq')
        spinButtons()
        background.style.cssText = "animation: gradient 1s ease infinite; background: linear-gradient(to right, red, blue); background-size: 400%;";
    } else {
        instrumental.pause()
        calculator.classList.remove('big-shaq')
        spinButtons(false)
        background.style.cssText = "animation: none; background-size: 100%; background: white;";
    }

}



