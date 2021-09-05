import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecRepeat(logger) {
	const cases = [
		{'code': `repeat 3 [
	show repcount
]`, 'messages': ['1', '2', '3']},
		{'code': `repeat 3 [
	repeat 1 [
		show repabove 1
	]
]`, 'messages': ['1', '2', '3']},
	];
	processTranslateExecuteCases(cases, logger);
};