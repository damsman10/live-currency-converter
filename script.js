const skip = document.getElementById('skip');
const welcomeScreen = document.getElementById('welcomeScreen');
const converter = document.querySelector('.converter');

//get the p for countdown
const countdownP = document.getElementById('countdown');
const currencyFromParent = document.getElementById('currencies-from');
const currencyToParent = document.getElementById('currencies-to');




//call the result screen and input amount
const result = document.getElementById('result-screen')
const amount = document.getElementById('amount')

skip.addEventListener('click', () => {
    welcomeScreen.style.display = "none";
    converter.style.display = "block";
});


// Countdown timer
let i = 3;

function countdown() {
    if (i > 0) {
        countdownP.innerHTML = i;
        i--;
    } else {
        welcomeScreen.style.display = "none";
        converter.style.display = "block";

        clearInterval(intervalid); //stop the interval when countdown is down
    }

}

const intervalid = setInterval(countdown, 1000);

let conversionRatesObject = {};
let selectedOption1 = 'USD';
let selectedOption2 = 'USD';




async function fetchExchangeRate() {

    try {
        const response = await fetch("https://v6.exchangerate-api.com/v6/6cf0e9cb14b177df0268f825/latest/USD");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        conversionRatesObject = data.conversion_rates;
        document.getElementById('last-update').innerText = `Last Update Time: ${data.time_last_update_utc}`;
        document.getElementById('next-update').innerText = `Next Update Time: ${data.time_next_update_utc}`;

        populateDropdowns (conversionRatesObject);

        // document.getElementById('apiData').innerHTML = JSON.stringify(object.keys(conversion_rates), null, 2);
    } catch (error) {
        console.error('Error fetching the Exchange Rate data: ', error)
    }

}


function populateDropdowns(conversionRatesObject){


    //Now I need the keys of the object as options for my select element
    //so lets use the object constructor
    const objectKeys = Object.keys(conversionRatesObject);
    

    //loop through each key
    for (const key of objectKeys) {

        const optionFrom = document.createElement('option');
        const optionTo = document.createElement('option');

        optionFrom.value = key;
        optionFrom.textContent = key;
        optionTo.value = key;
        optionTo.textContent = key;

        currencyFromParent.appendChild(optionFrom);
        currencyToParent.appendChild(optionTo);


    }


    
    currencyFromParent.addEventListener('change', (event) => {
        selectedOption1 = event.target.value;
        // compute();
    })
    currencyToParent.addEventListener('change', (event) => {
        selectedOption2 = event.target.value;
        // compute();
    })
    
    

}

function compute() {


    // const objectEntries = Object.entries(conversionRatesObject)

    const rateFrom = conversionRatesObject[selectedOption1];
    const rateTo = conversionRatesObject[selectedOption2];

    
    // alert (rateFrom);
    // alert (rateTo);


    if (amount.value === "" || isNaN(amount.value)) {
        throw new Error ("Not a Number");
    }

    const conversionRate = (rateTo * parseFloat(amount.value))  / rateFrom;
    result.value = conversionRate;
    
    
    // document.getElementById('conversion-rate').innerText = `1 ${selectedOption1} = ${conversionRate.toFixed(4)} ${selectedOption2}`;  
          
          

}



countdown();
fetchExchangeRate();

