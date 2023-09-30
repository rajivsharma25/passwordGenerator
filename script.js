const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={[}]|:;"<,>.?/';

//initially values
let password = "";  //string
let passwordLength = 10;
let checkCount = 0;  // 1 mean starting me ek checkbox to select hoga hi kam se kam
setIndicator("#ccc");//set strength circle color to gray 
handleSlider();  //staring me value ko 10 per set karne k liye call kar diye

//set passwordLength - default value
function handleSlider() {                                       // password length ko UI per show karata h 
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch add karenge
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;  //shadow adding in circle
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {   //single digit
    return getRndInteger(0, 10);
}

function generateLowerCase() {      //single digit
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {      //single digit
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNum = true;
    }
    if (symbolsCheck.checked) {
        hasSym = true;
    }

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }

    // to make copy wala span visible-----------
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)  //non-empty value 
        copyContent();

    //one more way
    // if(password != 0)
    // copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition 
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

console.log("yaha tak sahi hai");

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
console.log("yaha tak sahi hai");

generateBtn.addEventListener('click', () => {
    //if none of the checkbox are selected
    if (checkCount == 0) {
        return;
    }

    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find new password
    console.log("starting the journey");
    //remove old password
    password = "";

    //let's put the stuffs mentioned by the checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();     //boring
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];  // jo jo checked hai unke function ko funArr array k ander dal die hai

    if (uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funArr.push(generateSymbol);

    //compulsory addtion - jo jo function funArr array me usko call karake uske value ko password string me dal denge
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }
    console.log("compulsory addition done");
    //remaining addtion
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }
    console.log("remaining addition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done ");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");
    //calculate strength
    calcStrength();

});
