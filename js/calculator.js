

const buttonElements = document.getElementsByClassName("calc-button");
const input_display = document.getElementById('calc-display')


test()

function test () {

    for(const button of buttonElements) {
        button.addEventListener('click', event => {
            console.log("Button!")
            input_display.value += button.value;
        })
    }
    
}


function reset () {
    console.log("Clear!")
    input_display.value = "";
}



