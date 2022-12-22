const AnswerType = {
    FUNCTION: 0,
    NUMBER: 1,
    EXACT: 2
}

var quesTemplate = document.getElementById("question-template");
var checkpointTemplate = document.getElementById("checkpoint-template");

let questionsData = [
    {
        id: "tut1",
        prompt: `(Tutorial #1) For some questions, you will have to answer
        with an answer that is a number. For example, 
        if the answer is \\(\\frac{\\pi+e}{2}\\), then <span class="mono">(pi+e)/2</span>, 
        <span class="mono">0.5(pi+e)</span>, <span class="mono">2(pi+e)/(3+1)</span> etc. 
        will all be accepted. However, your answers will be checked to a higher precision
        than most calculators, so <b>do not enter approximate numbers as your answer</b>. 
        Try entering the answer below.`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: true,
        tutorialAnswer: "(pi+e)/2"
    },
    {
        id: "tut2",
        prompt: `(Tutorial #2) You can also have simple functions as part of your numerical
        answers if you wish. For example, if the answer is \\(\\sqrt{\\binom{5}{3} e^{\\sin \\ln 2}}\\),
        you may enter <span class="mono">sqrt(nCr(5,3) e^sin(ln(2)))</span>. Other available functions
        include <span class="mono">floor(x), cos(x), arcsin(x)</span> and more. 
        The input and output to all relevant functions are in radians.`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: true,
        tutorialAnswer: "sqrt(nCr(5,3) e^sin(ln(2)))"
    },
    {
        id: "tut3",
        prompt: `(Tutorial #3) For some questions, you may be asked to enter
        a function or expression. For example, if the question is asking for the product of
        \\(|x-1|\\) and \\(|x+1|\\), you could type <span class="mono">abs(x^2-1)</span> or
        <span class="mono">abs(x-1) * abs(x+1)</span>. All of these will be correct. You can also
        use the same functions introduced in the previous slide.
        <br>NOTE: When entering the product of lone varables, for example \\(ab\\), 
        please type something like <span class="mono">a*b</span>
        instead of <span class="mono">ab</span>. Otherwise, this may cause errors.`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{x: 1},{x: -100},{x: 2},{x: 4.5123},{x: 7},{x: 100},{x: 0}],
        isTutorial: true,
        tutorialAnswer: "abs(x^2-1)",
    },
    {
        id: "tut4",
        prompt: `(Tutorial #4) If mentioned explicitly, you will need to
        answer EXACTLY some text. For example, if the question instructs you to
        answer <b>exactly</b> the most simplified form of \\(x+x\\), answer <span class="mono">2x</span>.`,
        answerType: AnswerType.EXACT,
        signatureTests: null,
        isTutorial: true,
        tutorialAnswer: "2x"
    },
    {
        id: "altsum",
        prompt: `\\(1+2+3+4+5+6+7+8+9+1+2+3+4+5+7+8+9=?\\)<br>Input the answer <b>exactly</b> (the answer will not be calculated for you).`,
        answerType: AnswerType.EXACT,
        signatureTests: null,
        isTutorial: false,
    },
    {
        id: "21",
        prompt: `\\(9+10=2+?\\)`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "piano",
        prompt: `
        <video width="560" height="315" controls>
            <source src="assets/piano.mp4" type="video/mp4">
            </video>
        <br>
        What is the Opus number of this Chopin piece?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "ascii",
        prompt: `What is the ASCII code of the second letter of Obama's last name (lower case) <b>squared</b>?\\(\\)`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "derivative",
        prompt: `\\[一(己,已,巳)=\\frac{(己+已)(已+巳)(巳+己)}{己已巳}\\]
        \\[\\frac{\\partial^2一(己,已,巳)}{\\partial己\\partial已}|_{(己,已,巳)=(1,2,3)}=?\\]`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "sqrta",
        prompt: `Suppose \\(\\exists x \\in\\mathbb{R} - \\{0\\}, \\exists b \\in\\mathbb{R}, \\exists c \\in\\mathbb{R}, 
            \\exists a \\in \\mathbb{R}^+\\), <br>\\(ax^2-\\sqrt{a}bx+\\frac{c}{4}=0\\) holds.
            Find an expression for the maximal value of \\(\\sqrt{a}\\) in terms of \\(x,b,c\\).<br>
            (Reminder: if you want to enter the product of variables, ie. \\(bx\\), please type 
            <span class="mono">b*x</span> and not <span class="mono">bx</span>).`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{x: 1.2, b: 6.4,  c: 25.6}, {x: 1.3, b: -5.1,  c: 13.6}, {x: -0.9, b: 5.4,  c: -10}, {x: -1.1, b: 5.9,  c: 3.8}],
        isTutorial: false
    },
    {
        id: "infsum",
        prompt: `\\[\\lim_{N\\to\\infty}\\sum^
            {\\lfloor{\\sum^N_{k=1}{\\frac{1}{k}}}\\rfloor}_
            {{n=\\lceil\\sum^N_{k=1}\\frac{1}{2^k}}\\rceil}
            \\frac{\\left[\\lim_{a\\to\\infty}\\left(1+\\frac{i}{a}\\right)^a\\right]^{n \\pi i}}{n}= ?\\]
            \\[(\\text{where } i^2 = -1)\\]`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "epsdelta",
        prompt: `\\[f(x) = \\frac{x^2-2x+1}{x^2-1}\\]
        For any \\(0 <|\\varepsilon| < 1\\), define \\(S_\\varepsilon = \\{x \\in \\mathbb{R} : |f(x)| < \\varepsilon\\}\\). <br>
        In terms of \\(\\varepsilon\\), \\(\\inf{S_\\varepsilon} + \\sup{S_\\varepsilon} = ?\\)<br>
        You can enter the \\(\\varepsilon\\) symbol by typing <span class="mono">epsilon</span>.`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{"epsilon": -0.9}, {"epsilon": -0.6}, {"epsilon": -0.4}, {"epsilon": -0.2}, {"epsilon": 0.2}, {"epsilon": 0.4},
        {"epsilon": 0.6}, {"epsilon": 0.8}, {"epsilon": 1/Math.PI}, {"epsilon": 1/Math.E}],
        isTutorial: false
    },
    {
        id: "trig",
        prompt: `\\(\\arcsin{\\cos{\\left(\\frac{\\pi}{4}^\\circ\\right)}}=?\\) Give your answer in <b>gradians.</b>`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "eoneon",
        prompt: ` If \\(\\text{eon}\\,\\text{eon}-\\text{eon}=1\\), and \\(\\text{eon}<0\\), what is the value of \\(\\text{eon}\\,\\text{eon}\\)?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "radconv",
        prompt: `What is the radius of convergence of the Maclaurin series of 
        \\(f(x)=\\frac{x^p}{\\sqrt[q]{a+bx^r}}\\) where 
            \\(p,q,r \\in \\mathbb{Z}^+\\), and \\(a,b \\in \\mathbb{R} - \\{0\\}\\)? Give a closed-form
            solution (no limits, summations, etc) in terms of \\(p,q,r,a,b\\).`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [
            {a:17.951410983268488, b: 71.00672474332764, p: 3, q: 15, r: 3},
            {a:67.19835737627116, b: 21.359225615703302, p: 12, q: 8, r: 1},
            {a:93.1620704936473, b: 71.9596036916113, p: 19, q: 10, r: 4},
            {a:-13.689764206482458, b: -75.09780428040847, p: 13, q: 7, r: 7},
            {a:-26.90952442633565, b: 68.06066439448281, p: 4, q: 12, r: 3},
            {a:-62.46399529310771, b: 76.53885692031601, p: 18, q: 11, r: 16},
            {a:73.96341424849726, b: -5.018640271847907, p: 5, q: 11, r: 13},
            {a:54.653406566519436, b: -11.187164213160761, p: 13, q: 17, r: 6}
        ],
        isTutorial: false
    },
    {
        id: "unwin",
        prompt: `UnWin is very rude and wants to strong-slap some people.<br>
        There is a group of 16 people, and UnWin has enough energy to deliver
        32 strong-slaps to this group. Each person must be strong-slapped at least 
        once, but some may get more strong-slaps than others.
        <br>
        How many ways can UnWin distribute the strong-slaps? The order in which he
        strong-slaps does not matter.`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "meaninglife",
        prompt: `What is the meaning of \\(\\text{life}\\) if the following always holds true and we
        assume "meaning" is the same as "value"?
        \\[(\\text{life}<1) \\lor \\left(\\sum_{k=1}^\\infty \\frac{1}{k^\\text{life}} \\text{ converges}\\right)\\]
        \\[\\implies 1+2+3+4+\\cdots=-\\frac{1}{12}\\]`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "coprime",
        prompt: `How many numbers between \\(1\\) and \\(2^{\\text{The answer to life the universe and everything}}\\)
        (according to Google's calculator, at least) are not coprime with \\(69\\) 
        (ie, they share at least one commmon factor that is not \\(1\\))?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "limsequence",
        prompt: `For \\(c>0\\), consider the sequence:
        \\[a_0=\\alpha\\]
        \\[a_{n+1}=\\lim_{m\\to\\infty}\\left(1+\\frac{ca_n}{m}\\right)^m\\]

        For which value of \\(c \\in \\mathbb{R}\\) is there some <i>unique</i> \\(L \\in \\mathbb{R}\\) such that \\(\\forall \\alpha \\in \\mathbb{R}\\), 
        \\(\\lim_{n\\to\\infty} a_n \\text{ converges} \\implies \\lim_{n\\to\\infty} a_n = L\\)? In other words, for what value of \\(c\\) does the sequence
        always converge to the same value regardless of the starting value, given that it converges at all?
        Give your answer as the value of \\(c\\).`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "oldquiz",
        prompt: `Let \\(S = \\{x\\in\\mathbb{Z} : P(x)\\}\\), where \\(P(x)\\) is true if and only if \\(x\\) was an answer
        to the <b>very easy mathematics and human aptitude verification test</b> (available 
            <a href="https://cag2mark.github.io/MathsTest/" target="_blank">here</a>.) What is \\(|S \\times S|\\)?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "sunmass",
        prompt: `David has 4 apples. His train is 7 minutes early. What is the mass of the sun in yottagrams?
        Give your answer to 3 significant figures (you may use scientific notation). Do not enter units.`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "nerdsnipe",
        prompt: `<img src="assets/q18.png" style="width: 400px; max-width: 90%" id="q18-image"><br>
            In the original image, what is in the place of the red question mark? Give the answer <b>exactly</b>. (Hint: reverse image search exists)`,
        answerType: AnswerType.EXACT,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "integral",
        prompt: `What is the value of the following definite integral?
             \\[\\int^\\infty_{-\\infty} \\pi^{-|\\equiv|}\\, \\mathrm{d} \\equiv \\]`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "bessel",
        prompt: `Have a feel of my Calculus II final. Credit goes to my... <i>interesting</i> professor. Define the Bessel function of the \\(n\\)th order as follows:
        \\[J_n(x) = \\sum_{k=0}^\\infty \\frac{(-1)^k (\\frac{x}{2})^{2k+n}}{k!(n+k)!}\\]
        Let \\(f(x) = J_\\frac{1}{2}(x) + J_{-\\frac{1}{2}}(x)\\) for real \\(x > 0\\). Express \\(f(x)\\) in terms of elementary functions. You
        will need the results \\(\\left(-\\frac{1}{2}\\right)! = \\sqrt \\pi\\) and \\(n! = n(n-1)!\\) for \\(n \\in \\mathbb{R}\\).`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{x: 1}, {x: 1.5}, {x: Math.PI}, {x: 2}, {x: 3}, {x: 1000}, {x: 0.1}, {x: 0.01}],
        isTutorial: false
    },
];

// after question p, q, r, etc
var cp_pos = [4,6,8,12,16];

const ANS_HASH = "ec24c20bb9e91134478065ead310cfc8e3403e8c3be087d6c93399ee5b941063";
const CHECKPOINT_HASHES = ['27218f4b4c6c8ac8baebb2cbf76bdb2204643d3ac9f06db275b3a9b361ffa730', '43c3a55ec32c400d44bbbc19e757fa96bf13ec7b1e6c2b05ed316e496d7a8df7', 'e44646f9c8000ccc2a296a5d708f91ef0f2205b7ddc6f94574a3bc14fcf17bc0', '78589c4d3e8237d0fd41105d57f0fdd10f624d1def0d68a97c56b1720575d6c0', '44d3c4fc88bcfadba8bc37417965a39c3c1b23a13c8ef511452a047af0e45699'];
class Question {

    constructor(id, qNum, prompt, answerType, signatureTests = null, isTutorial=false, tutorialAnswer=null) {
        this.id = id;
        this.qNum = qNum;
        this.prompt = prompt;
        this.answerType = answerType;
        let node = quesTemplate.cloneNode(true);
        node.removeAttribute("id");
        this.node = node;
        this.signatureTests = signatureTests;
        this.isTutorial = isTutorial;
        this.tutorialAnswer = tutorialAnswer;
        
        this.promptBox = node.getElementsByClassName("question-text")[0];
        this.inputBox = node.getElementsByClassName("question-input")[0];
        this.answerPreview = node.getElementsByClassName("question-answer-preview")[0];

        this.promptBox.innerHTML = (isTutorial ? "" : `(Q${qNum})<br>`) + this.prompt;

        this.inputBox.addEventListener("keyup", (e) => {
            this.updateAnswer();
            config.questionAnswers[this.id] = this.getAnswerInput();
            saveConfig();
        });
    }

    updateAnswer() {
        let answer = this.getAnswerInput();

        if (!answer) { 
            this.answerPreview.innerHTML = "";
            return
        }
        if (this.answerType == AnswerType.EXACT) { 
            this.answerPreview.innerHTML = answer;
            if (this.isTutorial) 
                this.answerPreview.innerHTML += this.checkAnswer() ? " (Correct)" : " (Incorrect)";
            return;
        }

        try {
            let tex = math.parse(answer)
                .toTex(texOptions)
                .toString()
                .replaceAll("~", "")
                .replaceAll("varphi", "phi") // remove ugly default phi
                .replaceAll("phi", "varphi")
                .replaceAll("varepsilon", "epsilon")
                .replaceAll("epsilon", "varepsilon");
            if (this.answerType == AnswerType.NUMBER) {
                let evaled_ = math.evaluate(answer);
                let evaled = evaled_.toFixed(6);

                let isApprox = evaled.length < evaled_.toString().length;
                if (!isApprox) evaled = evaled_.toString();
                
                if (evaled.includes("function")) {
                    this.answerPreview.innerHTML = "(Error parsing)";
                } else if ( evaled != tex) {
                    this.answerPreview.innerHTML = `\\(${tex}${isApprox?"\\approx":"="}${evaled}\\)`
                } else {
                    this.answerPreview.innerHTML = `\\(${tex}\\)`
                }
            } else {
                this.answerPreview.innerHTML = `\\(${tex}\\)`
            }
            if (this.isTutorial) 
                this.answerPreview.innerHTML += this.checkAnswer() ? " (Correct)" : " (Incorrect)";
            renderMathInElement(this.answerPreview);
        } catch (error) {
            this.answerPreview.innerHTML = "(Error parsing)"
        }
    }

    getNode() {
        return this.node;
    }

    getAnswerInput() {
        return this.inputBox.value
            .trim();
    }

    getAnswer() {
        if (this.answerType == AnswerType.FUNCTION) {
            let f = new MathFunction(this.getAnswerInput());
            return f.getSignatureString(this.signatureTests);
        }
        if (this.answerType == AnswerType.NUMBER) {
            let val = math.evaluate(this.getAnswerInput());
            return numSigToString(numSignature(val));
        }
        if (this.answerType == AnswerType.EXACT) {
            return this.getAnswerInput();
        }
    }

    setAnswerText(val) {
        this.inputBox.value = val;
        this.updateAnswer();
    }

    // tutorial only
    checkAnswer() {
        if (this.answerType == AnswerType.FUNCTION) {
            let f = new MathFunction(this.getAnswerInput());
            let g = new MathFunction(this.tutorialAnswer);
            return f.equals(g, this.signatureTests);
        }
        if (this.answerType == AnswerType.NUMBER) {
            let val1 = math.evaluate(this.getAnswerInput());
            let val2 = math.evaluate(this.tutorialAnswer);
            return areSameFloats(val1, val2);
        }

        return this.getAnswerInput().trim() == this.tutorialAnswer.trim();
    }
}

var questions = [];

class Checkpoint {
    constructor(number, position, correct_hash) {
        this.number = number;
        this.position = position;
        this.correct_hash = correct_hash;

        let node = checkpointTemplate.cloneNode(true);
        node.removeAttribute("id");
        this.node = node;

        this.getNodeItem("checkpoint-number").innerHTML = number + 1;

        this.getNodeItem("checkpoint-button").addEventListener("click", (e) => this.checkQuestions());

        this.pages = [
            this.getNodeItem("checkpoint-correct"),
            this.getNodeItem("checkpoint-incorrect"),
            this.getNodeItem("checkpoint-error"),
        ]

        this.msgContainer = this.getNodeItem("checkpoint-msg-container");

        this.errorNoElem = this.getNodeItem("checkpoint-error-num");
        this.errorBtn = this.getNodeItem("checkpoint-error-redirect-button");

        this.codeOut = this.getNodeItem("code-out");

        this.errorBtn.addEventListener("click", (e) => {
            transition(quesSlideNo[this.latestErrorQues]);
        })
    }

    getNodeItem(className) {
        return this.node.getElementsByClassName(className)[0];
    }

    // show by id
    showPage(n) {
        this.pages[n].classList.remove("checkpoint-hidden");
        for (let i = 0; i < this.pages.length; ++i) {
            if (i == n) continue;
            this.pages[i].classList.add("checkpoint-hidden");
        }
    }

    checkQuestions() {
        
        this.msgContainer.classList.remove("checkpoint-hidden");

        // questions must be initialised
        let {val, errorQs} = getConcatedAnswers(this.position);
        
        if (!val) {
            this.showPage(2);
            this.errorNoElem.innerHTML = errorQs;
            this.latestErrorQues = errorQs;
            return;
        }
        let hash = sha256(val);
        let hash2 = sha256(hash);

        if (hash2 == CHECKPOINT_HASHES[this.number]) {
            this.showPage(0);
            this.codeOut.innerHTML = code.encryptMessage(ignInput.value, hash);
        } 
        else this.showPage(1);
    }

    getNode() {
        return self.node;
    }
}

// gets the number of checkpoints before the current question, assume cp_pos is sorted
// questionNo is 1-indexed
function getCheckpointCount(questionNo) {
    if (questionNo > cp_pos[cp_pos.length - 1]) return cp_pos.length;
    if (questionNo <= cp_pos[0]) return 0;

    // binary search
    let lower = 0;
    let upper = cp_pos.length - 1;
    let cur_pos = Math.floor((lower + upper) / 2);

    let lower_smaller, upper_bigger; 
    while (!(
        (lower_smaller = cp_pos[cur_pos-1] < questionNo) && 
        (upper_bigger = questionNo <= cp_pos[cur_pos])
        )) {

        if (lower_smaller && !upper_bigger) 
            lower = cur_pos + 1;
        else 
            upper = cur_pos - 1;

        cur_pos = Math.floor((lower + upper) / 2);
    }
    return cur_pos;
}

var questionNumberInput = document.getElementById("question-number");

// init questions
var body = document.body;

var wrap = document.getElementById("wrap");
var insertLoc = document.getElementById("questions-end");

var tutorialQuestionsCnt = 0;

let cp_ind = 0;

// generate the slide types here... anything other than a positive integer is not a question
let slideQuesNo = Array(document.getElementsByClassName("starting-slide").length).fill(0);

let quesSlideNo = Array(questionsData.length);

for (let i = 0, curSlideNo = slideQuesNo.length; i < questionsData.length; ++i, ++curSlideNo) {
    let q = questionsData[i];
    
    if (q.isTutorial) ++tutorialQuestionsCnt;

    let questionNumber = i - tutorialQuestionsCnt + 1;
    
    let question = new Question(
        q.id, i + 1 - tutorialQuestionsCnt, q.prompt, q.answerType, 
        q.signatureTests, q.isTutorial, q.tutorialAnswer
        );
        
    questions.push(question);
    slideQuesNo.push(questionNumber);
    quesSlideNo[questionNumber] = curSlideNo;

    let ans = config.questionAnswers[q.id];
    if (ans) {
        // set timeout to let the libraries have time to load
        setTimeout(() => {
            question.setAnswerText(ans);
        }, 100);
    }

    insertLoc.insertAdjacentElement('beforebegin', question.node);

    let next_cp_pos = cp_pos[cp_ind];
    if (questionNumber == next_cp_pos) {
        let c = new Checkpoint(cp_ind, next_cp_pos, CHECKPOINT_HASHES[cp_ind]);
        ++cp_ind;
        insertLoc.insertAdjacentElement('beforebegin', c.node);
        slideQuesNo.push(0);
        ++curSlideNo;
    }
}
slideQuesNo.push(0);

questionNumberInput.setAttribute("max", questions.length);