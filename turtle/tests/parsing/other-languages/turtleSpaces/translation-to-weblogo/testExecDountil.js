import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecDountil(logger) {
	const cases = [
		{'code': `make "counter 0
dountil :counter = 0 [
	make "counter :counter + 1
	print :counter
]`, 'messages': []
		},
		{'code': `make "counter 0
dountil :counter = 3 [
	make "counter :counter + 1
	print :counter
]`, 'messages': ['1', '2', '3']
		// copied and adapted from:
		// https://turtlespaces.org/reference/conditionals-and-flow/#cmd-dountil
		}
	];
	processTranslateExecuteCases(cases, logger);
};