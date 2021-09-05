import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslationToWebLogoExecutePrint(logger) {
	const cases = [
		{'code': 'print "hello"', 'messages': ['hello']},
		{'code': `LET x = 3
print "hello";x`, 'messages': ['hello3']},
		{'code': `LET x = 3
print "hello",x`, 'messages': ['hello\t3']},
		{'code': `int64 = 12345678
PRINT int64`, 'messages': ['12345678']},
		{'code': `SCREEN _NEWIMAGE(1000, 600, 256)
_SCREENMOVE _MIDDLE
print "hi"`, 'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};