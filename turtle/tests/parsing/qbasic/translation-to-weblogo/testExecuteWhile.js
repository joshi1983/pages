import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteWhile(logger) {
	const cases = [
		{'code': 'while false\nwend\nprint "hi"', 'messages': ['hi'], 'analyzeCodeQuality': false},
	];
	processTranslateExecuteCases(cases, logger);
};