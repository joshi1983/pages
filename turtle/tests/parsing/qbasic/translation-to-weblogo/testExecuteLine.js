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
	{'code': `line (0, 0)-(100, 0),,BF
print "hi"`,
	'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),3, B
print "hi"`, 'messages': ['hi']},
	{'code': `line (0, 0)-(100, 0),3, BF
print "hi"`, 'messages': ['hi']},
	{'code': `line step(0, 0)-step(100, 0),3, BF
print "hi"`, 'messages': ['hi']},
	{'code': `LINE (0, 0)-(10, 20), 2, B
print "hi"`, 'messages': ['hi']},
	{'code': 'LINE -(0, 100), 2\nprint "hi"',
		'messages': ['hi']}
	];
	processTranslateExecuteCases(cases, logger);
};