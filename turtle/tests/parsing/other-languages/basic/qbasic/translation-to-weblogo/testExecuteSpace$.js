import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSpace$(logger) {
	const cases = [
	// The following test case is adapted from:
	// https://qbasic.com/documentation/SPACE$.html
	{'code': `FOR i = 0 TO 2
  PRINT SPACE$(i); i
NEXT i`,
	'messages': ['0', ' 1', '  2']},
	];
	processTranslateExecuteCases(cases, logger);
};