
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


/*
Räknar ut resultatet.
 */
function calculate(result) {
    let stack = []
    stack.push(")");
    result += "(";

    for(let i = result.length; i >= 0; i--) {
        console.log(result[i]);
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
    } else if(val === 'CE') {
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


//återställer miniräknaren.
function reset () {
    input_display.value = "";
}



