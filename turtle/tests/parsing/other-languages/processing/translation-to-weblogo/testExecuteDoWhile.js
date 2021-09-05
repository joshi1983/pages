import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

/*
I couldn't find examples of do-while loops in the official Processing documentation
but this is how they would work in Java.
*/
export function testExecuteDoWhile(logger) {
	const cases = [
		{'code': 'x = 0; do { println(x); x = x+1; } while x < 2;',
			'messages': ['0', '1']},
		{'code': 'x = 0; do { println(x); x = x+1; } while x < 0;',
			'messages': ['0']},
	];
	processTranslateExecuteCases(cases, logger);
};