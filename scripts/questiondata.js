const AnswerType = {
    FUNCTION: 0,
    NUMBER: 1,
    EXACT: 2
}

// after question p, q, r, etc
var cp_pos = [4, 6, 8, 9, 11, 13, 16];

const ANS_HASH = "4157de8be8c06ef4a11c623f7598fd764310545275502ca9ffb011ed2edefb69";
const CHECKPOINT_HASHES = ['e1510202fc18098b6cd7ca78eb60b5f786bb915f9c2cee8222a1abf7503f5ac8', 'bda8a83b5d400cdc597963ec72fd5a79d631c2662e75666637602f10507a0991', '9b5af07f92cb2bd465bb58607fcd98c74d5a937469d90935965380039cced07b', '83ff2dbd3b4739c374dd06874dd7f22d32c50975ec90efd445bfe3186161bc61', '9abe7a6e7d8f4004477660274eefd88fbe8b91f846c087e2ba93a0cc11b55040', '927dcb5678bc3ea9ff925a984180168aca4b44c3c986a434225127c8cbc7914d', 'a235961bbacff9928a14ecfa19a141e04be390ce01aeaf5dd6bbf55ee8c66fc5'];
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
        \\(|xy-x|\\) and \\(|xy+x|\\), you could type <span class="mono">abs((x*y)^2 - x^2)</span> or
        <span class="mono">abs(x*y-x) * abs(x*y+x)</span>. All of these will be correct.`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": 1, "y": 1 }, { "x": -100, "y": 2 }, { "x": 2, "y": 0.51234 }, { "x": 4.5123, "y": 1 }, { "x": 7, "y": 0 }, { "x": 100, "y": 2 }, { "x": 0, "y": 0 }],
        isTutorial: true,
        tutorialAnswer: "abs((x*y)^2 - x^2)",
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
        prompt: `<img src="assets/q2.png" style="width: 400px; max-width: 90%">`,
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
        id: "proof",
        prompt: `How many references to other materials are in <a href="https://vixra.org/pdf/1208.0009v4.pdf" target="_blank">this paper</a>? (This is not a difficult question but I just want you to read the references because they are funny)
        <br><br>
        BTW the paper is wrong so don't trust it.`,
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
        signatureTests: [{ "x": 1, "y": 1, "n": 4 }, { "x": 2, "y": 5, "n": 0 }, { "x": -4, "y": 2, "n": 2 }, { "x": 0, "y": 10, "n": 3 }, { "x": 1.5, "y": -2.5, "n": 2 }, { "x": 2, "y": 1.001, "n": 15 }, { "x": 0.5015, "y": 2.129, "n": 10 }],
        isTutorial: false
    },
    {
        id: "polynomial",
        prompt: `Let \\(f_n(x) = 69 + \\frac{69}{42} x + \\frac{69^2}{42} x^2 + \\cdots + \\frac{69^{\\lfloor \\frac{n}{2} \\rfloor + 1}}{42^{\\lfloor \\frac{n + 1}{2} \\rfloor}} x^n \\) and \\(g(x) = 69x + 42\\). Then for \\(n > 69420\\), there exists a unique polynomial \\(q_n(x)\\) and constant \\(r_n\\) such that:
        \\[
            f_n(x) = q_n(x) g(x) + r_n    
        \\]
        Find the value of \\(\\displaystyle \\lim_{n\\to\\infty} \\frac{q_n(0)}{69 - r_n}\\).`,
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
        Find the polynomial \\(h(x)\\) with \\(\\deg h < \\deg f\\) such that \\(r(x) = 69\\). \\(h(x)\\) <b>must</b> be a polynomial.<br>(Hint: Write code to run polynomial division/modulo and XGCD.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": -2 }, { "x": 1 }, { "x": 0 }, { "x": 1 }, { "x": 2 }, { "x": 3 }, { "x": 1.5 }, { "x": 2.5 }],
        isTutorial: false
    },
    {
        id: "string",
        prompt: `A \\(CAG\\)-string is defined as a string of uppercase characters can be permuted into the form \\(CAGCAGCAG\\cdots CAG\\) (zero or more repeating \\(CAG\\)s) followed by at most two other characters. For example, \\(ACGFACAG\\) is a \\(CAG\\)-string as it can be permuted into \\(CAGCAGAF\\), but \\(CAGCAF\\) is not.
        <br>
        There are \\(26\\) \\(CAG\\)-strings of length 1, \\(26^2\\) of length \\(2\\) and \\(3!\\) of length \\(3\\).
        <br><br>
        How many \\(CAG\\)-strings of length \\(k\\) are there, for \\(k \\geq 0\\)? 
        <br>
        Note: you can use <span class="mono">floor(x)</span> as the floor function, <span class="mono">nCr(a,b)</span> to compute combinations, and <span class="mono">%</span> to compute mod. Also, assume that if \\(n < r\\), then \\(\\binom{n}{r} = 0\\).`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "k": 0 }, { "k": 1 }, { "k": 2 }, { "k": 3 }, { "k": 4 }, { "k": 5 }, { "k": 6 }, { "k": 7 }, { "k": 8 }, { "k": 9 }, { "k": 10 }, { "k": 11 }, { "k": 12 }, { "k": 13 }, { "k": 14 }, { "k": 15 }],
        isTutorial: false
    },
    {
        id: "cosine",
        prompt: `Find \\(f(x) = c_0 + c_1x^2\\) such that:
        \\[
            \\int^{\\pi}_{-\\pi} |f(x) - \\cos x|^2 \\, \\mathrm{d} x
        \\]
        is as small as possible.
        <br><br>
        (Hint: It is not \\(1 - \\frac{x^2}{2!}\\).)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "x": 0 }, { "x": 1 }, { "x": 2 }, { "x": 3 }, { "x": 4 }, { "x": -2 }, { "x": 0.5 }, { "x": -4 }],
        isTutorial: false
    },
    {
        id: "calculation",
        prompt: `Let \\(r\\) be a positive integer. Compute the limit: 
        \\[
            \\lim_{n\\to\\infty} \\left( n \\left[\\sum^r_{k=1} \\left( 1+\\frac{1}{n} \\right)^k\\right] - rn \\right)  
        \\]`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "r": 1 }, { "r": 10 }, { "r": 100 }, { "r": 200 }, { "r": 1023 }],
        isTutorial: false
    },
    {
        id: "riemannzeta",
        prompt: `Assuming that \\(\\displaystyle\\sum^\\infty_{k=1} \\frac{1}{k^{-1}} = -\\frac{1}{12} = \\zeta(-1)\\), give a real number \\(a \\in [0,1] - \\big\\{\\frac{1}{2}\\big\\}\\) such that 
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
        prompt: `Let \\(n \\in \\mathbb{Z}^+\\). Consider the vector space \\(V = \\{ (f, g, h) : f, g, h \\in S \\}\\), where:
        \\[
            S = \\big\\{ \\sum^n_{k=0} (a_k x^k + b_k y^k + c_k z^k) : \\forall 0 \\leq i \\leq n, \\, a_i, b_i, c_i \\in \\mathbb{R} \\big\\}
        \\]
        Let \\(W\\) be the subspace of all conservative vector fields on \\(\\mathbb{R}^3\\), i.e. for any closed curve \\(C\\), we have:
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
        prompt: `LogicBugs wants to open a casino, where if you play two diamonds, you have a probability \\(p\\) of winning back five diamonds. Each play is independent.
        Find the probability that you make a profit of 5 to 9 diamonds inclusive if you play \\(n\\) times. You can use <span class="mono">ceil(x)</span> as the ceiling function.`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{ "p": 0.3, "n": 1 }, { "p": 0.4, "n": 3 }, { "p": 0.5, "n": 6 }, { "p": 0.6, "n": 8 }, { "p": 0.75, "n": 10 }, { "p": 0.8, "n": 15 }, { "p": 0, "n": 20 }, { "p": 1, "n": 1 }, { "p": 1, "n": 0 }, { "p": 0.5, "n": 0 }],
        isTutorial: false
    }, 
    {
        id: "ellipticcurve",
        prompt: `Consider the elliptic curve \\(E\\) over \\(\\mathbb{R}\\):
        \\[
            y^2 = x^3 - 4
        \\]
        and the point \\(P = (2, 2) \\in E\\). Find the \\(y\\)-coordinate of the point \\(Q \\in E\\) such that : 
        \\[nP+nQ = \\begin{cases} P+Q & n \\text{ is odd}\\\\ \\mathcal{O} & \\text{otherwise} \\end{cases}  \\]
        for \\(n > 1\\) and \\(P + Q \\neq \\mathcal{O}\\). You may assume that \\(Q\\) is unique.
        `,
        answerType: AnswerType.NUMBER,
        signatureTests: null,
        isTutorial: false
    },
    {
        id: "zeta2",
        prompt: `Let \\(T\\) be a linear operator on \\(\\mathbb{R^n}\\), with \\(n > 4\\). Suppose \\(T\\) has the matrix:
        \\[
            \\mathcal{M}(T) = \\begin{bmatrix}
            \\lambda_1 &&&&&&0\\\\
            &\\lambda_2&&&&&\\\\
            &&\\ddots&&&&\\\\
            &&&r\\cos a & -r\\sin a&&\\\\
            &&&r\\sin a & r\\cos a&&\\\\
            &&&&&\\ddots&\\\\
            0&&&&&&\\lambda_{n-2}
            \\end{bmatrix}
            \\]
        where \\(0 < \\lambda_i\\), \\(0 < r < \\frac{1}{2}\\), \\(a \\in \\mathbb{R}\\) and \\(\\mathrm{trace} \\, T = 1\\). What is the largest possible value of \\( \\det T \\) you can obtain by only varying each \\(\\lambda_i\\)?`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{"r": 0.2, "n": 5, "a": 0.2}, {"r": 0.3, "n": 6, "a": 0.5}, {"r": 0.1, "n": 7, "a": 100}, {"r": 0.4, "n": 7, "a": -0.3}, {"r": 0.25, "n": 10, "a": 0.7}],
        isTutorial: false
    },
    {
        id: "sqrta",
        prompt: `Consider the vector field \\(\\mathbf{F}\\) and the region \\(S\\) for \\(a > 0\\):
        \\[
            \\mathbf{F} = \\left( \\frac{x}{\\sqrt{x^2+y^2+z^2}}, \\frac{y}{\\sqrt{x^2+y^2+z^2}}, \\frac{z}{\\sqrt{x^2+y^2+z^2}}\\right)
        \\]
        \\[
            S = \\{(x,y,z) : |x|, |y|, |z| \\leq a\\}
        \\]
        Compute the value of: 
        \\[\\oiint_{\\partial S} \\mathbf{F} \\cdot \\hat{\\mathbf{n}} \\, \\mathrm{d}S\\]
        where \\(\\partial S\\) is the boundary of \\(S\\) and
        \\( \\hat{\\mathbf{n}}\\) is the unit outward normal to \\(\\partial S\\) at the given point.
        <br><br>
        (Hint: Don't use the divergence theorem.)`,
        answerType: AnswerType.FUNCTION,
        signatureTests: [{a: 1}, {a: 10}, {a: 100}, {a: 1000}],
        isTutorial: false
    },
];