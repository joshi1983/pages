import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteOperators(logger) {
	const cases = [
		{'code': 'print 1+2', 'messages': ['3']},
		{'code': 'print(1+2)', 'messages': ['3']},
		{'code': 'print(1-3)', 'messages': ['-2']},
		{'code': 'print(2-3)', 'messages': ['-1']},
		{'code': 'print(1*2)', 'messages': ['2']},
		{'code': 'print(1**2)', 'messages': ['1']},
		{'code': 'print(2**3)', 'messages': ['8']},
		{'code': 'print(3/2)', 'messages': ['1.5']},
		{'code': 'print(2/2)', 'messages': ['1']},
		// 1.0 is printed by Python 3.13.0
		// 1 is close enough in WebLogo.

		{'code': 'print(2//3)', 'messages': ['0']},
		{'code': 'print(3//3)', 'messages': ['1']},
		{'code': 'print(4//3)', 'messages': ['1']},
		{'code': 'print(5//3)', 'messages': ['1']},
		{'code': 'print(6//3)', 'messages': ['2']},
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
	];
	processTranslateExecuteCases(cases, logger);
};