import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecFor(logger) {
	const cases = [
		{'code': `for [i 1 3] [
	show :i
]`, 'messages': ['1', '2', '3']},
	];
	processTranslateExecuteCases(cases, logger);
};