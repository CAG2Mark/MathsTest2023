// Maths Test Maths Checker Module

// Manages and uses things like the maths library
// to rough-check the equality of functions and numbers. 

const PRECISION = 14;
var max = Math.pow(10, PRECISION);

const customLaTeX = {
    'sqrt': function (node, options) { 
      return '\\sqrt{' + node.args[0].toTex(options) + '}';
    },
    'nCr': function (node, options) { 
        return `\\binom{${node.args[0].toTex(options)}}{${node.args[1].toTex(options)}}`;
    },
    'nPr': function (node, options) { 
        return `\\mathrm{nPr}(${node.args[0].toTex(options)},${node.args[1].toTex(options)})`;
    },
}

const texOptions = {
    parenthesis: 'auto',   
    implicit: 'hide',    
    handler: customLaTeX
}

function gcd(a,b) {
    if (!(Number.isInteger(a) && Number.isInteger(b))) return 1;
    a = Math.abs(a);
    b = Math.abs(b);
    while (b != 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function nCr(n, r) {
    if (n <= 0 || r < 0 || n < r) return 0;
    if (!Number.isInteger(r)) return NaN;
    var p = 1, k = 1;
    if (Number.isInteger(n) && n - r < r)
        r = n - r;
    if (r != 0) {
        while (r) {
            p *= n;
            k *= r;
            var m = gcd(p, k);
            p /= m;
            k /= m;
            --n;
            --r;
        }
    } else {
        p = 1;
    }
    return k == 1 ? p : p/k;
}

// Function to find the nCr
function nPr(n, r) {
    if (n <= 0 || r < 0 || n < r) return 0;
    if (!Number.isInteger(r)) return NaN;
    var p = 1;

    if (r != 0) {
        while (r) {
            p *= n;
            --n;
            --r;
        }
    } else {
        p = 1;
    }
    return p;
}

const customFunctions = {
    ln: Math.log,
    arccos: Math.acos,
    arctan: Math.atan,
    arcsin: Math.asin,
    arcsinh: Math.asinh,
    arccosh: Math.acosh,
    arctanh: Math.atanh,
    nCr: nCr,
    nPr: nPr,
}

math.import(customFunctions);

function numSignature(x) {
    let i = 0;
    while (Math.abs(x) < max && i < PRECISION) {
        x *= 10;
        ++i;
    }
    return { val: Math.trunc(x), pow: i.toString() };
}

function numSigToString(x) {
    return `{${x.val},${x.pow}}`;
}

function signaturesEqual(x, y) {
    return x.val == y.val && x.pow == y.pow;
}

function areSameFloats(x, y) {
    return signaturesEqual(numSignature(x), numSignature(y));
}

function paramsToStr(p) {
    let entries = Object.keys(p);
    let ret = "[";
    for (let i = 0; i < entries.length; ++i) {
        if (i != 1) ret += ","
        ret += `${entries[i]}:${numSigToString(numSignature(p[entries[i]]))}`;
    }
    return ret + "]";
}

class MathFunction {
    constructor(func) {
        this.func = func;
    }

    /* vals could be like:
    [
        {'x': 1, 'y' = 2},
        {'x': 2, 'y' = 4} 
    ]
    */
    getSignature(vals) {
        let signature = [];
        for (let i = 0; i < vals.length; ++i) {
            let f = math.evaluate(this.func, vals[i]);
            signature.push({signature: numSignature(f), params: vals[i]});
        }
        return signature;
    }

    getSignatureString(vals) {
        let ret = "[";
        let signature = this.getSignature(vals);
        for (let i = 0; i < signature.length; ++i) {
            let point = signature[i];
            ret += `{${numSigToString(point.signature)},{${paramsToStr(point.params)}}}`;
            if (i != signature.length - 1) ret += ',';
        }
        ret += ']';
        return ret;
    }

    getLatex() {
        return math.parse(this.func).toTex();
    }

    // that: the other function.
    // vals: the set of vals used to getSignature
    equals(that, vals) {
        // should be same length
        let thisSig = this.getSignature(vals);
        let thatSig = that.getSignature(vals);
        for (let i = 0; i < thisSig.length; ++i) {
            if (!signaturesEqual(thisSig[i], thatSig[i])) return false;
        }
        return true;
    }
}