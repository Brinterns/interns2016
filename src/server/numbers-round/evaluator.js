module.exports = equationSolver;

var operatorStack = [];
var outputList = [];

function equationSolver(string, allowedList) {
    /*returns a number if expression is valid; null otherwise*/
    outputList = [];
    operatorStack = [];
    string = string.replace(/\s/g, '');
    string = string.split('');
    var expression = parse(string);
    if(expression !== null) {
        if(checkNumbersAllowed(expression, allowedList)) {
            return evaluate(expression);
        }
    }
    return null;
}

function isNumeric(token) {
    return '0123456789'.indexOf(token) !== -1;
}

function isOperator(token) {
    return '*/+-'.indexOf(token) !== -1;
}

function isNotAllowed(token) {
    return '0123456789*/+-()'.indexOf(token) === -1;
}

function parse(infix) {
    if(infix.length === 0) {
        return null;
    }
    var prev = false;
    var num = 0;
    for(var i = 0; i < infix.length; i++) {
        var token = infix[i];
        if(isNotAllowed(token)){
            return null;
        }
        if(isNumeric(token)){
            if(prev){
                num = num * 10 + parseInt(token);
            }
            else{
                prev = true;
                num = parseInt(token);
            }
        } else {
            if(prev) {
                outputList.push(num);
                prev = false;
                num = 0;
            }
            var operatorParse = operatorsAndBrackets(token);
            if(operatorParse === null) {
                return null;
            }
        }
    }
    if(prev) {
        outputList.push(num);
    }
    while(operatorStack.length > 0) {
        outputList.push(operatorStack.pop());
    }
    if(outputList.indexOf('(') !== -1 || outputList.length === 0)
        return null;
    return outputList;
}

var operators = {
    "/": {
        precedence: 3,
        associativity: "Left"
    },
    "*": {
        precedence: 3,
        associativity: "Left"
    },
    "+": {
        precedence: 2,
        associativity: "Left"
    },
    "-": {
        precedence: 2,
        associativity: "Left"
    }
}

function operatorsAndBrackets(token) {
    if(isOperator(token)) {
        var o1 = token;
        var o2 = operatorStack[operatorStack.length - 1];
        while(isOperator(o2) && (operators[o1].precedence <= operators[o2].precedence)) {
            outputList.push(operatorStack.pop());
            o2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(o1);
    }
    else if(token === "(") {
        operatorStack.push(token);
    } else if(token === ")") {
        while(operatorStack[operatorStack.length - 1] !== "(") {
            if(operatorStack.length === 0)
                return null;
            outputList.push(operatorStack.pop());
        }
        operatorStack.pop();
    }
}

function evaluate(list) {
    var stack = [];
    if(list === null)
        return null;
    for(var i = 0; i < list.length; i++) {
        if(!isOperator(list[i])){
            stack.push(list[i]);
        } else {
            if(stack.length < 2)
                return null;
            var val1 = stack.pop();
            var val2 = stack.pop();
            switch(list[i]){
                case '/':
                    stack.push(val2/val1);
                    break;
                case '*':
                    stack.push(val2*val1);
                    break;
                case '+':
                    stack.push(val2+val1);
                    break;
                case '-':
                    stack.push(val2-val1);
                    break;
                default:
                    break;
            }
        }
    }
    if(stack.length > 1)
        return null;
    return stack[0];
}

function checkNumbersAllowed(rpnExpression, allowed) {
    for(var i=0; i < rpnExpression.length; i++) {
        var index = allowed.indexOf(rpnExpression[i])
        if(typeof(rpnExpression[i]) === 'number') {
            if(index === -1){
                return false;
            }
            else {
                allowed.splice(index, 1);
            }
        }
    }
    return true;
}
