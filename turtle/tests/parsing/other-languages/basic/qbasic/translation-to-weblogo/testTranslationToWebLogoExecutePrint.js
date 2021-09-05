import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslationToWebLogoExecutePrint(logger) {
	const cases = [
		{'code': 'print "hello"', 'messages': ['hello']},
		{'code': 'print val "&h10"', 'messages': ['16']},
		{'code': 'print val "&o10"', 'messages': ['8']},
		{'code': 'print val "10"', 'messages': ['10']},
		{'code': 'print val "-10"', 'messages': ['-10']},
		{'code': `LET x = 3
print "hello";x`, 'messages': ['hello3']},
		{'code': `LET x = 3
print "hello",x`, 'messages': ['hello\t3']},
		{'code': `int64 = 12345678
PRINT int64`, 'messages': ['12345678']},
		{'code': `SCREEN _NEWIMAGE(1000, 600, 256)
_SCREENMOVE _MIDDLE
print "hi"`, 'messages': ['hi']},
		{'code': 'print space$ 0', 'messages': ['']},
		{'code': 'print space$ 1', 'messages': [' ']},
		{'code': 'print space$ 3', 'messages': ['   ']},
	];
	processTranslateExecuteCases(cases, logger);
};