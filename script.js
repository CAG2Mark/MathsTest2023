// Maths Test Main Script.

// Initialises everything and keeps everything running. 

// Source: https://stackoverflow.com/questions/51531021/javascript-aes-encryption-and-decryption-advanced-encryption-standard


let code = (function(){
    return{
      encryptMessage: function(messageToencrypt = '', secretkey = ''){
        var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
        return encryptedMessage.toString();
      },
      decryptMessage: function(encryptedMessage = '', secretkey = ''){
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
        var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

        return decryptedMessage;
      }
    }
})();

function getInput(obj) {
    return obj.getElementsByTagName("input")[0];
}

var finishButton = document.getElementById("get-code-button");
var ignInput = document.getElementById("ign-input");

var errorPage = document.getElementById("error-page");
var incorrectPage = document.getElementById("incorrect-page");
var correctPage = document.getElementById("correct-page");

var finishPages = [errorPage, incorrectPage, correctPage];

function showPage(page) {
    for (let i = 0; i < finishPages.length; ++i) {
        let cur = finishPages[i];
        if (cur === page) continue;
        cur.classList.add("end-page-hidden");    
    }
    page.classList.remove("end-page-hidden");
}

var latestErrorQuestion = 0;

document.getElementById("error-redirect-button").addEventListener("click", () => {
    transition(quesSlideNo[latestErrorQuestion]);
});

// n specifies which question you should check up to
// checks up to and including
function checkAnswers(n = -1) {
    let ign = ignInput.value;

    if (!ign.trim()) {
        alert("Please enter your IGN on the first page.")
        return;
    }

    let { val, errorQs } = getConcatedAnswers(n);

    if (!val) {
        // error
        document.getElementById("error-question-num").innerHTML = errorQs;
        latestErrorQuestion = errorQs;
        showPage(errorPage);
        return;
    }

    console.log(val);

    let hash1 = sha256(val);
    let hash2 = sha256(hash1);

    console.log(hash1);
    console.log(hash2);

    if (hash2 == ANS_HASH) {
        let enc = code.encryptMessage(ign, hash1);
        document.getElementById("code-out").innerHTML = enc;
        showPage(correctPage);
    }
    else {
        showPage(incorrectPage);
    }
}

function getConcatedAnswers(n = -1) {
    let val = "";
    let upper = n == -1 ? questions.length : n + tutorialQuestionsCnt;

    for (var i = 0; i < upper; ++i) {
        let q = questions[i];
        if (q.isTutorial) continue;
        try {
            val += q.getAnswer() + ";";
        }
        catch (error) {
            return {val: null, errorQs: q.qNum}
        }
    }

    return {val: val, errorQs: 0};
}

finishButton.addEventListener("click", () => checkAnswers());

ignInput.addEventListener("focusout", (e) => {
    config.ign = ignInput.value;
    saveConfig();
})

ignInput.value = config.ign;

document.getElementById("q18-image").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    alert("You really thought I would let you reverse image search it directly? Lmao no")
    document.body.classList.add("LMAO-you-are-doing-the-inspect-element-of-shame-after-right-clicking-question-18s-image")
});

function createHashes() {
    let script = document.createElement('script');
    script.src = 'correctanswers.js';
    document.body.append(script);

    setTimeout(() => {
        printHashes();    
    }, 100);   
}

function checkCode(input, checkpoint = -1) {
    let script = document.createElement('script');
    script.src = 'correctanswers.js';
    document.body.append(script);

    setTimeout(() => {
        console.log(code.decryptMessage(input, getNthHash(checkpoint - 1)));  
    }, 100); 
}