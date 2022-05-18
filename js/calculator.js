
const buttonElements = document.getElementsByClassName("calc-button");
const quickMathSwitch = document.getElementById('math-switch');
const display = document.getElementById('display')
const calculator = document.getElementById('calculator')

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

    for(let i = 0; i < 62; i++) {
        quickMathAudio[i] = new Audio(`/audio/quickmath/${i+1}.mp3`)
    }

    instrumental.volume = .1
    instrumental.loop = true;

}


function getPriority(op) {
    switch (op) {
        case '(': return 0;
        case '-':
        case '+': return 1;
        case '/':
        case '*': return 2;
    }
}

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
Räknar ut resultatet.
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

function validateResult(pop) {

    console.log("Res: " + pop)

    if(isNumber(pop)) {
        display.value = pop;
    } else {
        display.value = "Error";
    }
}

function calculatePostFix(postfix) {
    let stack = [];

    for(let i = 0; i < postfix.length ; i++) {
        const symbol = postfix[i];

        //36, 9
        //+


        if(isNumber2(symbol)) {
            stack.push(symbol)
        } else {
            const num2 = stack.pop();
            const num1 = stack.pop();
            const op = symbol;
            const result = calculateExpression(num1, num2, op)
            console.log(`${num1} ${op} ${num2} = ${result}`)
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
    //console.log("empty: " + empty)
    return empty;
}


function removeLast() {
    display.value = display.value.slice(0, -1);
}


function canCalculate() {
    d = parseResult(display.value);
    console.log("par: " + d)
return parseResult(display.value).length >= 3;
    //return isOperator(display.value) && isNumber(getLastInput())
}

/*
Hanterar inmatning.
 */
function onInput(val) {

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
        playRandom()
    }

}


function playRandom() {
    const rand = Math.floor(Math.random() * quickMathAudio.length);
    quickMathAudio[rand].play();
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

function toggleQuickMath() {
    const on = quickMathSwitch.checked;

    if(on) {
        instrumental.loop
        instrumental.play();
        calculator.classList.add('big-shaq')
    } else {
        instrumental.pause()
        calculator.classList.remove('big-shaq')
    }

}



