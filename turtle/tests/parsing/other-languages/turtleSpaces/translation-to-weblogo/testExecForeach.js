import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecForeach(logger) {
	const cases = [
		{'code': `foreach "i [1 2 3] [
	show :i
]`, 'messages': ['1', '2', '3']},
		{'code': `foreach "i [9 10] [
	show :i
]`, 'messages': ['9', '10']},
		{'code': `make "x [9 10]
foreach "i :x [
	show :i
]`, 'messages': ['9', '10']}
	];
	processTranslateExecuteCases(cases, logger);
};