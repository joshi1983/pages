import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteAssignments(logger) {
	const cases = [
		{'code': 'x=3\nprint(x)', 'messages': ['3']},
		{'code': 'x=1\nx+=1\nprint(x)', 'messages': ['2']},
		{'code': 'x=1\nx+=2\nprint(x)', 'messages': ['3']},
		{'code': 'x=1\nx*=1\nprint(x)', 'messages': ['1']},
		{'code': 'x=1\nx*=2\nprint(x)', 'messages': ['2']},
		{'code': 'x=1\nx/=1\nprint(x)', 'messages': ['1']},
		{'code': 'x=1\nx/=2\nprint(x)', 'messages': ['0.5']},

		// %= modulo assignment
		{'code': 'x=0\nx%=2\nprint(x)', 'messages': ['0']},
		{'code': 'x=1\nx%=2\nprint(x)', 'messages': ['1']},
		{'code': 'x=1\nx%=3\nprint(x)', 'messages': ['1']},
		{'code': 'x=2\nx%=2\nprint(x)', 'messages': ['0']},

		// //= floored division assign
		{'code': 'x=8\nx//=1\nprint(x)', 'messages': ['8']},
		{'code': 'x=8\nx//=2\nprint(x)', 'messages': ['4']},
		{'code': 'x=8\nx//=4\nprint(x)', 'messages': ['2']},
		{'code': 'x=3\nx//=2\nprint(x)', 'messages': ['1']},
		{'code': 'x=-3\nx//=2\nprint(x)', 'messages': ['-2']},

		// The following doesn't pass yet because it looks like DT Python Parser does
		// not recognize the := operator.
		// An issue was added on the github project to point that out to maintainers of DT Python Parser:
		// https://github.com/DTStack/dt-python-parser/issues/28
		//{'code': 'x=1\nprint(x := 3)\nprint(x)', 'messages': ['3', '3']},

		// ^= bitwise xor assign
		{'code': 'x=1\nx^=3\nprint(x)', 'messages': ['2']},
		{'code': 'x=1\nx^=5\nprint(x)', 'messages': ['4']},

		// |= bitwise or assign
		{'code': 'x=1\nx|=3\nprint(x)', 'messages': ['3']},
		{'code': 'x=2\nx|=3\nprint(x)', 'messages': ['3']},
		{'code': 'x=8\nx|=3\nprint(x)', 'messages': ['11']},

		// &= bitwise and assign
		{'code': 'x=1\nx&=3\nprint(x)', 'messages': ['1']},
		{'code': 'x=2\nx&=3\nprint(x)', 'messages': ['2']},
		{'code': 'x=8\nx&=3\nprint(x)', 'messages': ['0']},
	];
	processTranslateExecuteCases(cases, logger);
};