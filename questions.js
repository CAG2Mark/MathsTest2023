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
        signatureTests: [{ x: 1 }, { x: -100 }, { x: 2 }, { x: 4.5123 }, { x: 7 }, { x: 100 }, { x: 0 }],
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
        id: "welcome",
        prompt: `What is the value of \\(0.00000000000001 + 0.0000000000002 + 0.000000000003 + 0.00000000004 + 0.00000000005\\)?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false,
    },
    {
        id: "image",
        prompt: `<img src="assets/q2.jpg" style="width: 400px; max-width: 90%">`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "lhopital",
        prompt: `In calculus, there is a rule that states, when direct substitution of \\(x = a\\) into the left limit yields \\(\\frac{0}{0}\\) or \\(\\frac{\\infty}{\\infty}\\), and the RHS limit exists:
        \\[
            \\lim_{x\\to a} \\frac{f(x)}{g(x)} = \\lim_{x\\to a} \\frac{f'(x)}{g'(x)}    
        \\]
        What is the surname of the person who discovered this rule? For example, if you think it is Isaac Newton, type <span class="mono">Newton</span> exactly. (Only use English alphabet letters; strip all other puncutation and accents.)`,
        answerType: AnswerType.EXACT,
        signatureTests: null,
        isTutorial: false,
    },
    {
        id: "fermat",
        prompt: `How many pages long is the paper containing the first published proof of Fermat's Last Theroem?`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "derivative",
        prompt: `Consider the function:
        \\[
        f(x, y) = e^{xy}
        \\]
        Find a closed-form expression for \\(\\displaystyle\\frac{\\partial^n f(x,y)}{\\partial x^n}\\). (Note: to type \\(xy\\), type <span class="mono">x*y</span> and not <span class="mono">xy</span>.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": 1, "y": 1, "n": 4 }, { "x": 2, "y": 5, "n": 0 }, { "x": -4, "y": 2, "n": 2 }, { "x": 0, "y": 10, "n": 3 }, { "x": 1.5, "y": -2.5, "n": 2 }, { "x": 2, "y": 1.001, "n": 100 }, { "x": 0.5015, "y": 2.129, "n": 10 }],
        isTutorial: false
    },
    {
        id: "polynomial",
        prompt: `Let \\(f_n(x) = 69 x^n + \\frac{69}{42} x^{n-1} + \\frac{69^2}{42} x^{n-2} + \\cdots + \\frac{69^{\\lfloor \\frac{n}{2} \\rfloor + 1}}{42^{\\lfloor \\frac{n + 1}{2} \\rfloor}} \\) and \\(g(x) = 69x + 42\\). Then for \\(n > 69420\\), there exists a unique polynomial \\(q_n(x)\\) and constant \\(r_n\\) such that:
        \\[
            f_n(x) = q_n(x) g_n(x) + r_n    
        \\]
        Find the value of \\(\\displaystyle \\lim_{n\\to\\infty} \\frac{q_n(0)}{r_n}\\).`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "recurrence",
        prompt: `Define the sequences:
        \\[\\begin{gather*}
        a_0 = 1, b_0 = 0\\\\
        a_n = \\left(\\cos \\frac{1}{n^2}\\right) a_{n-1} - \\left(\\sin \\frac{1}{n^2}\\right) b_{n-1}\\\\
        b_n = \\left(\\sin \\frac{1}{n^2}\\right) a_{n-1} + \\left(\\cos \\frac{1}{n^2}\\right) b_{n-1}
        \\end{gather*}\\]
        Find \\(\\displaystyle\\lim_{n\\to\\infty} (a_n + b_n)\\).`,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "polynomial2",
        prompt: `Let \\(f(x) = 1 + 4x^2 + 9x^4\\) and \\(g(x) = 1 + 3x + 6x^2\\). Then, for any non-zero polynomial \\(h(x)\\), there are unique polynomials \\(q(x), r(x)\\), with \\(\\deg r < \\deg f\\), such that:
        \\[
            g(x)h(x) = f(x)q(x) + r(x)
        \\]
        Find \\(h(x)\\) such that \\(r(x) = 69\\). \\(h(x)\\) <b>must</b> be a polynomial.<br>(Hint: Write code to run polynomial division/modulo and XGCD.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": -2 }, { "x": 1 }, { "x": 0 }, { "x": 1 }, { "x": 2 }, { "x": 3 }, { "x": 1.5 }, { "x": 2.5 }],
        isTutorial: false
    },
    {
        id: "string",
        prompt: `A \\(CAG\\)-string is defined as a string of uppercase characters can be permuted into the form \\(CAGCAGCAG\\cdots CAG\\) (zero or more repeating \\(CAG\\)s) followed by at most two other characters. For example, \\(ACGGACAF\\) is a \\(CAG\\)-string as it can be permuted into \\(CAGCAGAF\\), but \\(CAGCAF\\) is not.
        <br>
        There are \\(26\\) \\(CAG\\)-strings of length 1, \\(26^2\\) of length \\(3\\) and \\(3!\\) of length \\(3\\).
        <br><br>
        How many \\(CAG\\)-strings of length \\(k\\) are there? 
        <br>
        Note: you can use <span class="mono">floor(x)</span> as floor function, <span class="mono">nCr(a,b)</span> to compute combinations, and <span class="mono">%</span> to compute mod. Also, assume that if \\(n < r\\), then \\(\\binom{n}{r} = 0\\).`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "k": 0 }, { "k": 1 }, { "k": 2 }, { "k": 3 }, { "k": 4 }, { "k": 5 }, { "k": 6 }, { "k": 7 }, { "k": 8 }, { "k": 9 }, { "k": 10 }, { "k": 11 }, { "k": 12 }, { "k": 13 }, { "k": 14 }, { "k": 15 }, { "k": 30 },],
        isTutorial: false
    },
    {
        id: "cosine",
        prompt: `Find \\(f(x) = c_0 + c_1x^2\\) such that it is the best appromation to \\(\\cos x\\) in the range \\([-\\pi, \\pi]\\), i.e.:
        \\[
            \\int^{\\pi}_{-\\pi} |f(x) - \\cos x|^2 \\, \\mathrm{d} x
        \\]
        is as small as possible.
        <br><br>
        (Hint: It is not \\(1 - \\frac{x^2}{2!}\\). Instead, consider orthogonal projections onto a subspace of \\(\\mathbf{C}_\\mathbb{R}[-\\pi, \\pi]\\). And by the way, if you plot this approximation, it is horrible.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": 0 }, { "x": 1 }, { "x": 2 }, { "x": 3 }, { "x": 4 }, { "x": -2 }, { "x": 0.5 }, { "x": -4 }],
        isTutorial: false
    },
    {
        id: "calculation",
        prompt: `Let \\(r\\) be a positive integer. Compute the limit: 
        \\[
            \\lim_{n\\to\\infty} \\left( n \\left[\\sum^r_{k=1} \\left( 1+\\frac{1}{n} \\right)^k\\right] - r \\right)  
        \\]`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "r": 1 }, { "r": 10 }, { "r": 100 }, { "r": 200 }, { "r": 1023 }],
        isTutorial: false
    },
    {
        id: "riemannzeta",
        prompt: `Suppose \\(\\displaystyle\\sum^\\infty_{k=1} k = -\\frac{1}{12}\\). Using this, give a real number \\(a \\neq \\frac{1}{2}\\) such that 
        \\[\\exists b \\in \\mathbb{R}: \\zeta(a + bi) = 0\\]
        where \\(\\zeta(s)\\) is the Riemann-Zeta function.`,
        answerType: AnswerType.NUMBER,
        isDummy: true,
        signatureTests: null,
        isTutorial: false,
    },
    {
        id: "volume",
        prompt: `Find the volume bounded by the surface \\((x^2 + y^2 + z^2)^2 = a^2(x^2 + y^2 - z^2)\\) for \\(a \\in \\mathbb{R}\\). (Hint: spherical coordinates.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "a": 1 }, { "a": 0 }, { "a": -1 }, { "a": 5 }, { "a": 8 }, { "a": 9.5 }, { "a": 10 }],
        isTutorial: false
    },
];

// after question p, q, r, etc
var cp_pos = [4, 6, 8, 9, 11];

const ANS_HASH = "0ea63c8e175eac09c61ceaf94e05c86f703faa88ec66bae9d319287dbf44da8f";
const CHECKPOINT_HASHES = ['4855fdefbdc8028668dbb5fcf0592cead7ee0437e916983394767939e75bf0d7', '62c66460ac2cc25ae6b596cc7032bef796f95e92787d9f57e054594d1522633d', 'aa2bdc49a6d2eff52a07bb515085315681b8c44d18ef245dc33607299125a31f', '1bf38a8644ffcd70c587ca4c857c078f87044d1ca15a824d9c519762e9b1a4ad', '7f3936ea4cdbef7dd8518d3d6cc0c7c25de55b7ffa35ffbc4aef9ecdd5d7db48'];

class Question {

    constructor(id, qNum, prompt, answerType, signatureTests = null, isTutorial = false, tutorialAnswer = null, isDummy = false) {
        this.id = id;
        this.qNum = qNum;
        this.prompt = prompt;
        this.answerType = answerType;
        this.isDummy = isDummy;
        let node = quesTemplate.cloneNode(true);
        node.removeAttribute("id");
        this.node = node;
        this.signatureTests = signatureTests;
        this.isTutorial = isTutorial;
        this.tutorialAnswer = tutorialAnswer;

        this.promptBox = node.getElementsByClassName("question-text")[0];
        this.inputBox = node.getElementsByClassName("question-input")[0];
        this.answerPreview = node.getElementsByClassName("question-answer-preview")[0];
        this.inputWrap = node.getElementsByClassName("input-wrap")[0];
        this.warningButton = node.getElementsByClassName("question-warning-button")[0];
        this.warningBox = node.getElementsByClassName("warning-box")[0];

        this.warningButton.addEventListener("click", (e) => {
            this.warningBox.classList.toggle("hidden");
        })

        this.promptBox.innerHTML = (isTutorial ? "" : `(Q${qNum})<br>`) + this.prompt;

        this.inputBox.addEventListener("keyup", (e) => {
            this.updateAnswer();
            config.questionAnswers[this.id] = this.getAnswerInput();
            saveConfig();
        });

        this.precomputeVariables();
    }

    precomputeVariables() {
        if (!this.signatureTests) {
            this.variables = null;
            return;
        }

        // precompute variables
        this.variables = new Set();
        this.signatureTests.forEach(keys => {
            for (var k in keys) {
                this.variables.add(k);
            }
        });
    }

    validateParsed(parsed) {
        let ret = [];
        parsed.traverse((node, path, parent) => {
            if (!node.isSymbolNode && !node.isFunctionNode) return;
            if (parent && parent.isFunctionNode && parent.name == node.name) return;

            let str = node.name;
            let flag = false;

            let fixed = "";

            if (str.length == 1 && node.isSymbolNode) return;

            for (let i = 0; i < str.length; ++i) {
                if (this.variables.has(str[i])) {
                    if (i) fixed += " ";
                    fixed += str[i];
                    continue;
                }

                flag = true;
                break;
            }

            if (flag) return;

            let warning;
            if (node.isFunctionNode) {
                warning = `<span class="mono">${node.toString()}</span> will be interpreted as a function. Try <span class="mono">${fixed} * ${node.toString().substring(str.length)}</span> instead.`;
            } else {
                warning = `<span class="mono">${str}</span> will be interpreted as a single variable. Try <span class="mono">${fixed}</span> instead.`;
            }
            ret.push(warning);

        });
        return ret;
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
            let parsed = math.parse(answer);

            if (this.answerType == AnswerType.FUNCTION) {
                let warnings = this.validateParsed(parsed);

                if (warnings.length) {
                    this.inputWrap.classList.add("input-warning");

                    let temp = "<ul>";
                    warnings.forEach(warning => {
                        temp += `<li>${warning}</li>`
                    });
                    temp += "</ul>";
                    this.warningBox.innerHTML = temp;

                } else {
                    this.inputWrap.classList.remove("input-warning");
                    this.warningBox.classList.add("hidden");
                }
            }

            let tex = parsed
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
                } else if (evaled != tex) {
                    this.answerPreview.innerHTML = `\\(${tex}${isApprox ? "\\approx" : "="}${evaled}\\)`
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
            console.log(error);
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
        if (this.isDummy) {
            return "you are a filthy cheater by looking at this :(";
        }
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
        let { val, errorQs } = getConcatedAnswers(this.position);

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
        (lower_smaller = cp_pos[cur_pos - 1] < questionNo) &&
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

function saveAllAnswers() {
    questions.forEach(q => {
        config.questionAnswers[q.id] = q.getAnswerInput();
    });
    saveConfig();
}

slideQuesNo.push(0);

questionNumberInput.setAttribute("max", questions.length);