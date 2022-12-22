# MathsTestNew
This is a maths test I created as an Aprils Fools joke.

However, this project *does* provide a useful framework for creating client-side maths quizzes that auto-check your answers without revealing the answers themselves.

A live demo is available [here](https://mathstest.markng.com/).
# Explanation
This framework checks the user's answers by evaluating their concatenated hashes and comparing them to the hashes of the correct answers.

It supports three types of answers:
* Number: Some real number.
* Function: Some function of any variable. Note that in this case, a question asking "find the derivative of f(x) = ax" would have `a` and `x` as variables too.
* Exact: A text input that is case sensitive.

To check if a function is correct, you supply a set of comparison points
and it checks if the entered function matches the correct function's at those points. 

# Usage

You need to only edit `questions.js` to create your own quiz.

Firstly, modify the `questionsData` array. Each entry represents a question, and should be an object in the following format:
```js
{
        id: "...", // a unique ID for the question
        prompt: "...", // the prompt of the question, ie "What is 1+1"
        answerType: AnswerType.FUNCTION, // the type of the answer. can be NUMBER, FUNCTION or EXACT.
        signatureTests: [{x: 1, y: 2}, {x:2, y: 4}], // A set of points where the answer function will be evaluated at for comparison. Only needed if the answer type is a function; enter null otherwise. 
        isTutorial: true, // True if it is a tutorial/example question.
        tutorialAnswer: "x^2 + y^2" // The tutorial/example answer. Put null if it is not a tutorial question.
}
``` 
Also modify the `cp_pos` array to add checkpoints where the user can check their answers. For example, if you want a checkpoint after question 4, 8 and 12, put `[4, 8, 12]`.

Create a file called `correctanswers.js` and paste the contents of this into it:

```js
var correctAnswers = [
    ...
];

function printHashes() {
    let tutorials = 0;
    for (let i = 0; i < correctAnswers.length + tutorials; ++i) {
        if (questions[i].isTutorial) {
            ++tutorials;
            continue;
        };
        questions[i].setAnswerText(correctAnswers[i - tutorials]);
    }
    console.log("Checkpoint hashes:");

    let hashes = Array(cp_pos.length);
    for (let i = 0; i < cp_pos.length; ++i) {
        console.log(cp_pos);
        hashes[i] = sha256(sha256(getConcatedAnswers(cp_pos[i]).val));
    }

    console.log(hashes)

    let all_conc = getConcatedAnswers().val;
    console.log("First hash (encrypt):");
    let hash1 = sha256(all_conc);
    console.log(hash1);
    console.log("Second hash (check correctness):");
    console.log(sha256(hash1));
}

function getNthHash(checkpoint) {
    let all_conc;
    if (checkpoint == -1)
        all_conc = getConcatedAnswers().val;
    else
        all_conc = getConcatedAnswers(cp_pos[checkpoint]).val;
    return sha256(all_conc);
}
```
Replace the `correctanswers` array with the correct answers, in order, to your questions. Do not include answers to tutorial questions.

Open the page up in your browser and run `createHashes()`. Copy the array that follows `Checkpoint hashes: ` into `CHECKPOINT_HASHES` in `questions.js`. Copy the hash after `Second hash (check correctness):` into `ANS_HASH`.

You can now delete `correctanswers.js` if you wish.