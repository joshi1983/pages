import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecAssignment(logger) {
	const cases = [
		{'code': 'val n = 19\nprintln(n)', 'messages': ['19']},
		{'code': 'var n : Int = 19\nprintln(n)', 'messages': ['19']},
	];
	processTranslateExecuteCases(cases, logger);
};