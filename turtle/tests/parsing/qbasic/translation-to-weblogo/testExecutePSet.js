import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecutePSet(logger) {
	const cases = [
	{'code': `pset (0, 0)
print "hi"`,
	'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};