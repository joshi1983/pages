import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecWhile(logger) {
	const cases = [
		{'code': `var x = 0
while (x < 2) {
	println(x)
	x += 1
}`, 'messages': ['0', '1']},
	];
	processTranslateExecuteCases(cases, logger);
};