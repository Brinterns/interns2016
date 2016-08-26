var evaluator = require('./evaluator');

describe('Expression parser', () => {
    describe('correctly formed expressions that should be evaluated correctly if all numbers are allowed', () => {

        it('should parse numbers', () => {
            expect(evaluator('127', [127])).toEqual(127);
        });

        it('should parse expressions with plus and minus correctly', () => {
            expect(evaluator('123-24+99', [123, 24, 99])).toEqual(198);
        });

        it('should parse expressions with multiplication correctly', () => {
            expect(evaluator('127*3*5-24*2*6+1', [127,3,5,24,2,6,1])).toEqual(127*3*5-24*2*6+1);
        });

        it('should parse expressions with division correctly', () => {
            expect(evaluator('127-49/7+1', [127,49,7,1])).toEqual(127-49/7+1);
        });

        it('should parse expressions with both division and multiplication correctly', () => {
            expect(evaluator('125*3/5-24*2/6+1', [125,3,5,24,2,6,1])).toEqual(125*3/5-24*2/6+1);
        });

        it('should respect brackets', () => {
            expect(evaluator('127-48/(7+1)-270/(10*3)', [127,48,7,1,270,10,3])).toEqual(127-48/(7+1)-270/(10*3));
        })

        it('should be able to deal with many brackets around one expression', () => {
            expect(evaluator('123-(((((((((((((((((((((((((((((((((((((((((24+99)))))))))))))))))))))))))))))))))))))))))', [123,24,99])).toEqual(0);
        });

        it('should parse expressions with arbitrary many blank spaces', () => {
            expect(evaluator('125      *3 /    5 -   24     *2   /6 +  1 ', [125,3,5,24,2,6,1])).toEqual(125*3/5-24*2/6+1);
        });

    });

    describe('not allowed numbers should be detected', () => {
        it('should return null if numbers not in allowed list are used in expression', () => {
            expect(evaluator('127-48/(7+1)-270/(10*3)', [137,48,7,1,271,10,3])).toBeNull();
        });

        it('should return null if numbers from allowed list are used too many times', () => {
            expect(evaluator('127-48/(7+1)-270/(10*3)+127', [127,48,7,1,270,10,3])).toBeNull();
        });

        it('should return correct if numbers from allowed list are used fewer than allowed', () => {
            expect(evaluator('123+123-3*123+4-3', [3,123,3,123,4,123])).toEqual(123+123-3*123+4-3);
        });
    })

    describe('malformed expressions that should be detected', () => {

        it('should return null if expression contains characters which are not numbers, operators(+,-,/,*) or brackets', () =>{
            expect(evaluator('123+a-232fdgsfdsfsdfsdfir43;-4,23.32', [123,232,43,4,23.32,23,32])).toBeNull();
        });

        it('should return null if expression contains unmatched brackets', () =>{
            expect(evaluator('12+((3-5)', [12,3,5])).toBeNull();
        });

        it('should return null if expression contains unmatched brackets', () =>{
            expect(evaluator('12+(3-5))', [12,3,5])).toBeNull();
        });

        it('should return null if expression is empty', () => {
            expect(evaluator('', [])).toBeNull();
        });

        it('should return null if expression contains only spaces no matter how many', () => {
            expect(evaluator('                                    ', [])).toBeNull();
        });

        it('should return null if expression contains a negative number only', () => {
            expect(evaluator('-2', [2,-2])).toBeNull();
        });

        it('should return null if expression contains negative numbers anywhere in the expression', () => {
            expect(evaluator('1+93*43-(-2)+2310/5', [1,93,43,2,-2,2310,5])).toBeNull();
        });

        it('should return null if expression contains negative numbers anywhere in the expression without brackets around them', () => {
            expect(evaluator('1+93*43--2+2310/5', [1,93,43,2,-2,2310,5])).toBeNull();
        });

        it('should return null if expression contains negative numbers anywhere in the expression without brackets around them', () => {
            expect(evaluator('-1+93*43-2+2310/5', [-1,1,93,43,2,-2,2310,5])).toBeNull();
        });

        it('should return null if expression contains too many operators', () => {
            expect(evaluator('1++2', [1,2])).toBeNull();
        });

        it('should return null if expression only contains operators', () => {
            expect(evaluator('+', [])).toBeNull();
        });

        it('should return null if expression only contains brackets', () => {
            expect(evaluator('(((((((((((((((((())))))))))))))))))', [])).toBeNull();
        });

        it('should return null if expression only contains operators and brackets', () => {
            expect(evaluator('+)', [])).toBeNull();
        });
    });
});
