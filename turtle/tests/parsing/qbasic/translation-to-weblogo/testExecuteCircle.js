import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteCircle(logger) {
	const cases = [
	{'code': `CIRCLE (320, 100), 200
print "hi"`,
	'messages': ['hi']},
	{'code': `CIRCLE step(320, 100), 200
print "hi"`,
	'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};