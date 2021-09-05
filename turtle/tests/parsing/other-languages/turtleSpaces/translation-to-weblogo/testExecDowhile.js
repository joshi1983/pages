import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecDowhile(logger) {
	const cases = [
		{'code': `make "counter 0
dowhile :counter < 0 [
	make "counter :counter + 1
	print :counter
]`, 'messages': []},
		{'code': `make "counter 0
dowhile :counter < 3 [
	make "counter :counter + 1
	print :counter
]`, 'messages': ['1', '2', '3']}
	];
	processTranslateExecuteCases(cases, logger);
};