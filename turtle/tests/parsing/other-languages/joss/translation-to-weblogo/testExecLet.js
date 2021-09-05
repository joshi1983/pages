import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecLet(logger) {
	const cases = [
		{'code': `Let f()=3.
Type f()`, 'messages': ['3']},
		{'code': `Let f(x)=x+3.
Type f(2)`, 'messages': ['5']},
		{'code': `Let f(x)=x*2.
Type f(4)`, 'messages': ['16']
			// 16 because 4 squared is 16.
			// x*2 is squaring x. Not doubling it.
		},
		{'code': `Let exponent(x,y)=x*y.
Type exponent(7,2)`, 'messages': ['49']
		}
	];
	processTranslateExecuteCases(cases, logger);
};