import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteOperators(logger) {
	const cases = [
		{'code': 'print 1+2', 'messages': ['3']},
		{'code': 'print(1+2)', 'messages': ['3']},
		{'code': 'print(12+2)', 'messages': ['14']},
		{'code': 'print(1-3)', 'messages': ['-2']},
		{'code': 'print(2-3)', 'messages': ['-1']},
		{'code': 'print(1*2)', 'messages': ['2']},
		{'code': 'print(3*4)', 'messages': ['12']},

		// ** is exponentiation similar to WebLogo's power command
		{'code': 'print(1**2)', 'messages': ['1']},
		{'code': 'print(2**3)', 'messages': ['8']},

		{'code': 'print(3/2)', 'messages': ['1.5']},
		{'code': 'print(2/2)', 'messages': ['1']},
		// 1.0 is printed by Python 3.13.0
		// 1 is close enough in WebLogo.

		{'code': 'print(0//3)', 'messages': ['0']},
		{'code': 'print(2//3)', 'messages': ['0']},
		{'code': 'print(3//3)', 'messages': ['1']},
		{'code': 'print(4//3)', 'messages': ['1']},
		{'code': 'print(5//3)', 'messages': ['1']},
		{'code': 'print(6//3)', 'messages': ['2']},
		{'code': 'print(-6//3)', 'messages': ['-2']},
		{'code': 'print(-5//3)', 'messages': ['-2']},
		{'code': 'print(-4//3)', 'messages': ['-2']},
		{'code': 'print(-3//3)', 'messages': ['-1']},

		// % modulo
		{'code': 'print(0%2)', 'messages': ['0']},
		{'code': 'print(1%2)', 'messages': ['1']},
		{'code': 'print(-1%2)', 'messages': ['1']},
		{'code': 'print(-19%12)', 'messages': ['5']},
		{'code': 'print(-20%12)', 'messages': ['4']},
		{'code': 'print(-21%12)', 'messages': ['3']},

		{'code': 'print(1<2)', 'messages': ['true']},
		{'code': 'print(2<2)', 'messages': ['false']},
		{'code': 'print(3<2)', 'messages': ['false']},
		{'code': 'print(1<=2)', 'messages': ['true']},
		{'code': 'print(2<=2)', 'messages': ['true']},
		{'code': 'print(3<=2)', 'messages': ['false']},
		{'code': 'print(3>2)', 'messages': ['true']},
		{'code': 'print(2>2)', 'messages': ['false']},
		{'code': 'print(1>2)', 'messages': ['false']},
		{'code': 'print(3>=2)', 'messages': ['true']},
		{'code': 'print(2>=2)', 'messages': ['true']},
		{'code': 'print(1>=2)', 'messages': ['false']},
		{'code': 'print(1==2)', 'messages': ['false']},
		{'code': 'print(2==1)', 'messages': ['false']},
		{'code': 'print(1==1)', 'messages': ['true']},
		{'code': 'print(1!=1)', 'messages': ['false']},
		{'code': 'print(0!=1)', 'messages': ['true']},
		
		// & is bitwise and.
		{'code': 'print(0&1)', 'messages': ['0']},
		{'code': 'print(0&2)', 'messages': ['0']},
		{'code': 'print(1&2)', 'messages': ['0']},
		{'code': 'print(1&3)', 'messages': ['1']},
		{'code': 'print(3&3)', 'messages': ['3']},
		{'code': 'print(1&1)', 'messages': ['1']},
		{'code': 'print(1&-1)', 'messages': ['1']},
		{'code': 'print(-1&-3)', 'messages': ['-3']},

		// | is bitwise or.
		{'code': 'print(0|1)', 'messages': ['1']},
		{'code': 'print(0|2)', 'messages': ['2']},
		{'code': 'print(1|2)', 'messages': ['3']},
		{'code': 'print(1|3)', 'messages': ['3']},
		{'code': 'print(3|3)', 'messages': ['3']},
		{'code': 'print(1|1)', 'messages': ['1']},
		{'code': 'print(1|-1)', 'messages': ['-1']},
		{'code': 'print(-1|-3)', 'messages': ['-1']},
		
		// ^ is bitwise xor
		{'code': 'print(0^1)', 'messages': ['1']},
		{'code': 'print(0^2)', 'messages': ['2']},
		{'code': 'print(1^2)', 'messages': ['3']},
		{'code': 'print(1^3)', 'messages': ['2']},
		{'code': 'print(3^3)', 'messages': ['0']},
		{'code': 'print(1^1)', 'messages': ['0']},
		{'code': 'print(1^-1)', 'messages': ['-2']},
		{'code': 'print(-1^-3)', 'messages': ['2']},
		
		// ~ bitwise not
		{'code': 'print(~0)', 'messages': ['-1']},
		{'code': 'print(~2)', 'messages': ['-3']},
		{'code': 'print(~3)', 'messages': ['-4']},
		{'code': 'print(~-1)', 'messages': ['0']},
		{'code': 'print(~-2)', 'messages': ['1']},

		// logical not
		{'code': 'print(not True)', 'messages': ['false']},
		{'code': 'print(not False)', 'messages': ['true']},

		// logical or
		{'code': 'print(False or False)', 'messages': ['false']},
		{'code': 'print(False or True)', 'messages': ['true']},
		{'code': 'print(True or False)', 'messages': ['true']},
		{'code': 'print(True or True)', 'messages': ['true']},

		// logical and
		{'code': 'print(False and False)', 'messages': ['false']},
		{'code': 'print(False and True)', 'messages': ['false']},
		{'code': 'print(True and False)', 'messages': ['false']},
		{'code': 'print(True and True)', 'messages': ['true']},

		// is operator.. similar to == but intended for comparing object references.
		// These cases use 'is' on number literals because
		// that's not an error in Python.
		// Python 3.13.0 does print warning messages with these, though.
		{'code': 'print(1 is 1)', 'messages': ['true']},
		{'code': 'print(1 is 2)', 'messages': ['false']},
		{'code': 'print("hi" is "hello")', 'messages': ['false']},
		{'code': 'print("hi" is "hi")', 'messages': ['true']},

		// << bit shift left
		{'code': 'print(1 << 0)', 'messages': ['1']},
		{'code': 'print(1 << 1)', 'messages': ['2']},
		{'code': 'print(1 << 2)', 'messages': ['4']},
		{'code': 'print(2 << 0)', 'messages': ['2']},
		{'code': 'print(2 << 1)', 'messages': ['4']},
		{'code': 'print(2 << 2)', 'messages': ['8']},
		{'code': 'print(-1 << 0)', 'messages': ['-1']},
		{'code': 'print(-1 << 1)', 'messages': ['-2']},
		{'code': 'print(-1 << 2)', 'messages': ['-4']},

		// >> bit shift right
		{'code': 'print(1 >> 0)', 'messages': ['1']},
		{'code': 'print(1 >> 1)', 'messages': ['0']},
		{'code': 'print(5 >> 0)', 'messages': ['5']},
		{'code': 'print(5 >> 1)', 'messages': ['2']},


		// some larger expressions to look for problems with order of operation.
		{'code': 'print(5 + 4 - 7 + 3)', 'messages': ['5']},
		{'code': 'print(1 + 2**3)', 'messages': ['9']},
		{'code': 'print(1 + 2**3 - 2)', 'messages': ['7']},
		{'code': 'print(2*3+1)', 'messages': ['7']},
		{'code': 'print(1/2*3+1)', 'messages': ['2.5']},
		{'code': 'print(1//2*3+1)', 'messages': ['1']},
		{'code': 'print(1//2*3+1<0)', 'messages': ['false']},
	];
	processTranslateExecuteCases(cases, logger);
};