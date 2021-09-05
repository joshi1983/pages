import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteMath(logger) {
	const cases = [
		{'code': 'console.log(Math.abs(-1))', 'messages': ['1']},
		{'code': 'console.log(Math.abs(1))', 'messages': ['1']},
		{'code': 'console.log(Math.PI)', 'messages': ['3.141593']},
	];
	processTranslateExecuteCases(cases, logger);
};