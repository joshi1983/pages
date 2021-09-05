import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute(logger) {
	const cases = [
		{'code': 'print "hi"', 'messages': ['hi']},
		{'code': '10 call print ";"', 'messages': [';']},
		{'code': '10 CALL print MAX(3,8)', 'messages': ['8']},
		{'code': '10 CALL print MIN(3,8)', 'messages': ['3']},
		{'code': '10 CALL print SQR 4', 'messages': ['2']}, // SQR calculates square root.
		{'code': '10 CALL print PI', 'messages': ['3.141593']},
		{'code': '10 CALL print SQR 4', 'messages': ['2']},
		{'code': '10 CALL print SIN(PI)', 'messages': ['0']},
	];
	processTranslateExecuteCases(cases, logger);
};