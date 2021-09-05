import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

/*
These tests compare Python's order of operation with WebLogo's translation and execution.
This should find bugs related to operator precedence.

These cases are made with outputs the same or as close as reasonably 
possible to output from the cPython 3.13 interpreter.

The main difference is that when python prints a boolean value, it is either True or False.
In WebLogo, the printed value is either true or false.
*/
export function testExecuteOrderOfOperation(logger) {
	const cases = [
		{'code': 'print(1+2*3)', 'messages': ['7']}, // Python 3.13 prints 7.
		{'code': 'print((1+2)*3)', 'messages': ['9']}, // Python 3.13 prints 9.
		{'code': 'print(1*2+3)', 'messages': ['5']}, // Python 3.13 prints 5.
		{'code': 'print(1*2**3)', 'messages': ['8']}, // Python 3.13 prints 8.
		{'code': 'print(1-2**3)', 'messages': ['-7']}, // Python 3.13 prints -7.
		{'code': 'print(1+2**3)', 'messages': ['9']}, // Python 3.13 prints 9
		{'code': 'print(-2**3)', 'messages': ['-8']}, // Python 3.13 prints -8
		{'code': 'print(1-2+3)', 'messages': ['2']}, // Python 3.13 prints 2.
		{'code': 'print(1/2+3)', 'messages': ['3.5']}, // Python 3.13 prints 3.5.
		{'code': 'print(1/2*3)', 'messages': ['1.5']}, // Python 3.13 prints 1.5.
		{'code': 'print(2*1/2)', 'messages': ['1']}, // Python 3.13 prints 1.0
		{'code': 'print(True or False)', 'messages': ['true']}, // Python 3.13 prints True
		{'code': 'print(True or False and True)', 'messages': ['true']}, // Python 3.13 prints True
		{'code': 'print(True or False and False)', 'messages': ['true']}, // Python 3.13 prints True
		{'code': 'print((True or False) and False)', 'messages': ['false']}, // Python 3.13 prints False
		{'code': 'print(2 < 1)', 'messages': ['false']}, // Python 3.13 prints False
		{'code': 'print(2 < 1 or 1 < 2)', 'messages': ['true']}, // Python 3.13 prints True
		{'code': 'print(2 < 1 and 1 < 2)', 'messages': ['false']}, // Python 3.13 prints False
		{'code': 'print(True == False)', 'messages': ['false']}, // Python 3.13 prints False
		{'code': 'print(5 % 2)', 'messages': ['1']}, // Python 3.13 prints 1
		{'code': 'print(5 % 2 + 1)', 'messages': ['2']}, // Python 3.13 prints 2
		{'code': 'print(5 % 2 * 3)', 'messages': ['3']}, // Python 3.13 prints 3
		{'code': 'print(5 % 2 / 2)', 'messages': ['0.5']}, // Python 3.13 prints 0.5
		{'code': 'print(5 % 2 ** 2)', 'messages': ['1']}, // Python 3.13 prints 1
		{'code': 'print(5 // 2)', 'messages': ['2']}, // Python 3.13 prints 2
		{'code': 'print(15 // 2 * 2)', 'messages': ['14']}, // Python 3.13 prints 14
		{'code': 'print(5 | 2)', 'messages': ['7']}, // Python 3.13 prints 7
		{'code': 'print(5 | 2 < 5)', 'messages': ['false']}, // Python 3.13 prints False
		{'code': 'print(5 & 2)', 'messages': ['0']}, // Python 3.13 prints 7
		{'code': 'print(5 & 2 < 5)', 'messages': ['true']}, // Python 3.13 prints True
	];
	processTranslateExecuteCases(cases, logger);
};