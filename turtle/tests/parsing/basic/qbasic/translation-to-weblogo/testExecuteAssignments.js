import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteAssignments(logger) {
	const cases = [
	{'code': `LET screen9 = 3
   PRINT screen9`,
	'messages': ['3']},
	];
	processTranslateExecuteCases(cases, logger);
};