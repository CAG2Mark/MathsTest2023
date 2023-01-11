var quesTemplate = document.getElementById("question-template");
var checkpointTemplate = document.getElementById("checkpoint-template");

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

        this.inputBox.addEventListener("keydown", (e) => {
            if (e.keyCode == 13 && !e.shiftKey) {
                goNextSlide(true);
                e.preventDefault();
                return;
            }
        })

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
            .trim()
            .replaceAll("\n", "");
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
        q.signatureTests, q.isTutorial, q.tutorialAnswer, q.isDummy
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