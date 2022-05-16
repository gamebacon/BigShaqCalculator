

const buttonElements = document.getElementsByClassName("calc-button");
const input_display = document.getElementById('calc-display')


init()

/*
initialiserar
 */
function init () {

    for(const button of buttonElements) {
        button.addEventListener('click', event => {
            onInput(button.value)
        })
    }
}


/*
kollar om inmatningen är en opperatär
 */
function isOperator(op) {
    isop = /[/*+-]/.test(op);

    console.log("op: " + isop + ">" + op + "<");

    return isop;
}

/*
kollar om inmatning är ett nummer.
 */
function isNum(val) {
    return /\d/.test(val);
}

/*
hämtar senaste karaktären i input-displayen.
 */
function getLastInput() {
    return input_display.value.slice(-1);
}

/*
kalkulerar inmatning.
 */
function calculate(result) {

}


function isEmpty() {
    empty = input_display.value.length == 0;
    console.log("empty: " + empty)
    return empty;
}



/*
Hanterar inmatning.
 */
function onInput(val) {

    if(val === 'C') { //Återställer miniräknaren.
        reset()
    } else if(val === '=') { //beräknar uttrycket.
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



