// 'use-strict';

const TOAST_CONTAINER = document.getElementById('toasts-container');

//* The left side elements
const ALL_NUMERIC_INPUTS = document.querySelectorAll('[inputmode="number"]');
const INPUT_BILL = document.querySelector('.input-bill');
const INPUT_NUM_OF_PPL = document.querySelector('.input-numOfPpl');
const TIP_PERCENT_CONTAINER = document.querySelector('.tip-percent');
const ALL_TIP_PERCENT = document.querySelectorAll('.tip-percent__num');
const BTN_CUSTOM = document.querySelector('.custom');

//* The right side elements
const LBL_PRICE_PER_PERSON = document.querySelector('.tip-amount__price');
const LBL_TOTAL_PRICE = document.querySelector('.tip-amount__totalPrice');
const BTN_RESET = document.querySelector('.btn-reset');


//* tasks to do 
//* D 1- Control inputs for characters* and zero
//* D 2- Use event delegation to set the chosen percent for the tip calcuting formula*
//* D 3- Use event delegation to change the custom btn to an input on click*
//* D 4- Calculate the total price*
//* D 5- Display the calculated price on the right side on blur (the last input, form submit event)*

//* D 6- NaN error on UI when clicks and blurs with no inputs*
//* D 7- custom percent input / btn switch + use it in the formula*

//* D 8- invalid html text + invalid situation handler + cant be zero wont reset + it shrinks my input *
//*8 D 9- toast notif for that invalid // Guard clause
//* D 10- custom input grows taller horizentally

//!* 11- incase user forgets to set any of the inputs especially percents
//! 12- RESPONSIVE DEGIL KI !
//* D 13- custom invalid won't reset + shows nan when it's zero and continues the operation
//* D 14- use math.round and toFixed to avoid getting crazy numbers for numbers bellow 1*
//! 15- put the custom input in a function bc u have to call it multiple times to get rid of it

function App() {
    let USER_PERCENT_OF_CHOICE;
    let TIP_PER_PERSON;
    let TOTAL_TIP;
    let NEW_CUSTOM_PERCENT;
    let INPUT_FIELD;
    

    //input validation

    ALL_NUMERIC_INPUTS.forEach((input) => {
        validateInput(input);
    })

    function validateInput(el) {
        el.addEventListener('beforeinput', function(e) {
            
            let beforeValue = el.value;
            e.target.addEventListener("input", () => {
                if (el.validity.patternMismatch) {
                    el.value = beforeValue;
                }
            }, {once: true} )
        })
    }

    // percent selection 

    TIP_PERCENT_CONTAINER.addEventListener('click', userChoice);

    function userChoice(e) {
        e.preventDefault();

        if (e.target.classList.contains('tip-percent__num'))
        {
            ALL_TIP_PERCENT.forEach( tip => tip.classList.remove('user-choice'));
            e.target.classList.add('user-choice');
            USER_PERCENT_OF_CHOICE = e.target.dataset.percent;
        } 

        if(e.target.classList.contains('custom')) {
            
            ALL_TIP_PERCENT.forEach( tip => tip.classList.remove('user-choice'));
            e.target.classList.add('hidden');
            const html = `<input type="text" class="input tip-percent__num custom-input" inputmode="number" pattern="[0-9]+">`
            TIP_PERCENT_CONTAINER.insertAdjacentHTML('beforeend', html);
            NEW_CUSTOM_PERCENT = document.querySelector('.custom-input');
            NEW_CUSTOM_PERCENT.focus();
            NEW_CUSTOM_PERCENT.addEventListener('blur', function (e) {
                e.preventDefault();
                NEW_CUSTOM_PERCENT.classList.remove('invalid-custom');

                if (!+NEW_CUSTOM_PERCENT.value) {
                    //! TOAST NOTIF
                    createNotification('Can\'t be zero percent', 'zero-alert');
                    NEW_CUSTOM_PERCENT.classList.add('invalid-custom');
                    LBL_PRICE_PER_PERSON.textContent = LBL_TOTAL_PRICE.textContent = '0.00';    
                    return;
                }
                
                USER_PERCENT_OF_CHOICE = +NEW_CUSTOM_PERCENT.value;
            })
          
        }
    } 

    // tip calculation 

    INPUT_NUM_OF_PPL.addEventListener('blur', function() {
    
        INPUT_FIELD = INPUT_NUM_OF_PPL.closest('.input-field')
        INPUT_FIELD.classList.remove('invalid');
        
        // NEW_CUSTOM_PERCENT.classList.remove('invalid-custom');
       
        let BILL = +INPUT_BILL.value;
        let NUM_OF_PPL = +INPUT_NUM_OF_PPL.value;

        // Guard clause
        if ( !BILL || !NUM_OF_PPL) {
            const INPUT_FIELD = INPUT_NUM_OF_PPL.closest('.input-field')
            INPUT_FIELD.classList.add('invalid');
            LBL_PRICE_PER_PERSON.textContent = LBL_TOTAL_PRICE.textContent = '0.00';
            //! TOAST NOTIF
            createNotification('Please insert a number', 'zero-alert');
            return;
        }
        if (!+USER_PERCENT_OF_CHOICE) {
            createNotification('You must choose a percent', 'user-choice-null');
            LBL_PRICE_PER_PERSON.textContent = LBL_TOTAL_PRICE.textContent = '0.00';
         
            return;
        }

        function calcTip() {
             //tip per person
            TIP_PER_PERSON = Math.round(BILL * (USER_PERCENT_OF_CHOICE/100), 2);
            LBL_PRICE_PER_PERSON.textContent = TIP_PER_PERSON; 


            //total tip
            TOTAL_TIP = TIP_PER_PERSON * NUM_OF_PPL;
            LBL_TOTAL_PRICE.textContent = TOTAL_TIP;
        }

        calcTip();
    
    })
    
    // reset btn 
    
    BTN_RESET.addEventListener('click', reset);
    function reset () {
        USER_PERCENT_OF_CHOICE = TIP_PER_PERSON = TOTAL_TIP = 0;
        LBL_PRICE_PER_PERSON.textContent = LBL_TOTAL_PRICE.textContent = '0.00';
        INPUT_BILL.value = INPUT_NUM_OF_PPL.value = '';
        INPUT_FIELD.classList.remove('invalid');
        NEW_CUSTOM_PERCENT.classList.add('hidden');
        BTN_CUSTOM.classList.remove('hidden');
        // CUSTOM BTN

    }

    // toast notif 
    function createNotification(message = null, type = null) {
        const notif = document.createElement('div');
        notif.classList.add('toast');
        notif.classList.add(type);
        notif.innerText = message;
        TOAST_CONTAINER.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 2500);
    }
}

App();

