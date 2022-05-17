
const buttonElements = document.getElementsByClassName("calc-button");
const input_display = document.getElementById('calc-display')

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
}


function getOperatorPriority(op) {
    switch (op) {
        case '(': return 0;
        case '-':
        case '+': return 1;
        case '/':
        case '*': return 2;
    }
}

/*
Räknar ut resultatet.
 */
function calculate(result) {
    let stack = []
    let postfix = []

    //result = `(${result})`;

    for(const symbol of result) {

        if(isNum(symbol)) {
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
            for(let i = 0; i < stack.length; i++)
                if(getOperatorPriority(stack[stack.length - 1]) >= getOperatorPriority(symbol))
                    postfix.push(stack.pop());
                else
                    break;
            stack.push(symbol);

        }
    }

    for(let i = 0; i < stack.length; i++) {
        postfix.push(stack.pop())
    }

    console.log(postfix.toLocaleString());
    calculatePostFix(postfix);
}

function calculateExpression(num1, num2, op) {
    switch(op) {
        case '-': return num1 - num2;
        case '+': return num1 + num2;
        case '/': return num1 / num2;
        case '*': return num1 * num2;
    }
}

function calculatePostFix(postfix) {
    let stack = [];

    for(let i = 0; i < postfix.length - 1; i++) {
        const symbol = postfix[i];

        if(isNum(symbol)) {
            stack.push(symbol)
        } else {
            const num1 = stack.pop();
            const num2 = stack.pop();
            const op = stack[i];
            const result = calculateExpression(num1, num2, op)
            stack.push(result);
        }

    }

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
function isNum(val) {
    return /\d/.test(val);
}

/*
Hämtar senaste karaktären i input-displayen.
 */
function getLastInput() {
    return input_display.value.slice(-1);
}


/*
 Kollar om det är tomt i display rutan.
 */
function isEmpty() {
    let empty = input_display.value.length === 0;
    //console.log("empty: " + empty)
    return empty;
}


function removeLast() {
    input_display.value = input_display.value.slice(0, -1);
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
        calculate(input_display.value);
    } else if(canInput(val)) //lägger till händelsen i minnet efter kontroll.
        input_display.value += val;

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
    input_display.value = "";
}



