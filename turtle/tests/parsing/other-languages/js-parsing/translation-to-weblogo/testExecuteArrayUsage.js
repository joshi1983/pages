import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteArrayUsage(logger) {
	const cases = [
		{'code': 'const a = []; console.log(a.length)', 'messages': ['0']},
		{'code': 'const a = []; a.push(123);console.log(a.length)', 'messages': ['1']},
	];
	processTranslateExecuteCases(cases, logger);
};