import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteLine(logger) {
	const cases = [
	{'code': `line (0, 0)-(100, 0)
print "hi"`,
	'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),,B
print "hi"`,
	'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),,FB
print "hi"`,
	'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),3, B
print "hi"`, 'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),3, FB
print "hi"`, 'messages': ['hi']}
	];
	processTranslateExecuteCases(cases, logger);
};