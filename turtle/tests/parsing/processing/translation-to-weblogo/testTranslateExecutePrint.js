import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecutePrint(logger) {
	const cases = [
	{'code': 'println("hello")', 'messages': ['hello']},
	{'code': 'println(1)', 'messages': ['1']},
	{'code': 'println(1 + 2)', 'messages': ['3']},
	{'code': 'println(1 * 2)', 'messages': ['2']},
	{'code': 'println(1 - 2)', 'messages': ['-1']},
	{'code': 'println(1 << 2)', 'messages': ['4']},
	{'code': 'println(1 >> 2)', 'messages': ['0']},
	{'code': 'println(1 / 2)', 'messages': ['0.5']},
	{'code': 'println(true || false)', 'messages': ['true']},
	{'code': 'println(true && false)', 'messages': ['false']},
	{'code': 'println(true ^ false)', 'messages': ['true']},
	{'code': 'println(2 | 1)', 'messages': ['3']},
	{'code': 'println(2 & 1)', 'messages': ['0']},
	{'code': 'println(binary(20, 8))', 'messages': ['00010100']},
	//{'code': 'println(binary(#ff0201))', 'messages': ['111111110000001000000001']},
	];
	processTranslateExecuteCases(cases, logger);
};