import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteGeneral(logger) {
	const cases = [
	{'code': 'print "hi"', 'messages': ['hi']},
	{'code': 'REM a comment\n106 M=1\n105 SET DEGREES', 'messages': []}
	];
	processTranslateExecuteCases(cases, logger);
};
