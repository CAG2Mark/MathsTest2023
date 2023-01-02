const AnswerType = {
    FUNCTION: 0,
    NUMBER: 1,
    EXACT: 2
}

// after question p, q, r, etc
var cp_pos = [4, 6, 8, 9, 11, 14];

const ANS_HASH = "333b08017fac3a294ce7cb859ef6823944b18968350e88d639d03d6d850e960b";
const CHECKPOINT_HASHES = ['4855fdefbdc8028668dbb5fcf0592cead7ee0437e916983394767939e75bf0d7', '569d838ec99ac3d315f968b435d4b56b1870becee3246484804389a78e164fe9', 'b6072eebf0d796bf4dfd7fafa1d68087c6cacac81508f241288be88b25b45f09', '5652c7ca86811657f844d392e2b0d14870ae8d6d1762ec0fc6c26b55d31cda8d', 'f3a0f8af37c097c731664fb8c71f5877c9a2abc7b0d8b957198497ae38d2b482']

var questionsData = [
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
        Find a closed-form expression for \\(\\displaystyle\\frac{\\partial^n f(x,y)}{\\partial x^n}\\).`,
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
        Find the value of \\(\\displaystyle \\lim_{n\\to\\infty} \\frac{q_n(0)}{\\frac{69}{42} - r_n}\\).`,
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
        prompt: `Find \\(f(x) = c_0 + c_1x^2\\) such that it is the best approximation to \\(\\cos x\\) in the range \\([-\\pi, \\pi]\\), i.e.:
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
    {
        id: "vectorfield",
        prompt: `Let \\(V = \\{ (f, g, h) : f, g, h \\in P_n \\}\\), where \\(P_n\\) represents all \\(n\\)th-degree polynomials, be a vector space. 
        Let \\(W\\) the subsapce of all conservative vector fields on \\(\\mathbb{R}^3\\), i.e. for any simply connected curve \\(C\\), we have:
        \\[ 
            \\mathbf{F} \\in W \\implies \\oint_C \\mathbf{F} \\cdot \\mathrm{d} \\mathbf{r} = 0
        \\]
        Find \\(\\dim (V \\cap W)\\).
        `,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "n": 1 }, { "n": 2 }, { "n": 3 }, { "n": 4 }, { "n": 7 }, { "n": 10 }, { "n": 50 }, { "n": 100 }],
        isTutorial: false
    },
    {
        id: "casino",
        prompt: `LogicBugs wants to open a casino, where if you play two diamonds, you have a probability \\(p\\) of winning back three diamonds. Find the probability that you make a profit if you play \\(n\\) times.`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "p": 0.3, "n": 1 }, { "p": 0.4, "n": 3 }, { "p": 0.5, "n": 6 }, { "p": 0.6, "n": 8 }, { "p": 0.75, "n": 10 }, { "p": 0.8, "n": 15 }, { "p": 0, "n": 20 }, { "p": 1, "n": 1 }, { "p": 1, "n": 0 }, { "p": 0.5, "n": 0 }],
        isTutorial: false
    },
];