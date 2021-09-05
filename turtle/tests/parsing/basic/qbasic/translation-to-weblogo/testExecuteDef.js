import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteDef(logger) {
	const cases = [
	{'code': `DEF SEG=4
PRINT "hi"`,
	'messages': ['hi']},
	{'code': `def FNs
	FNs = "hi"
END DEF

print FNs()`,
	'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};