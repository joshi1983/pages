import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecutePrint(logger) {
	const cases = [
	{'code': 'println("hello")', 'messages': ['hello']},
	{'code': 'println("Hello")', 'messages': ['Hello']},
	{'code': 'println(1)', 'messages': ['1']},
	{'code': 'println(12)', 'messages': ['12']},
	{'code': 'println ( color(255, 204, 0) )', 'messages': ['-13312']},
	{'code': 'println(binary(20, 8))', 'messages': ['00010100']},
	{'code': 'println(binary(20, 4))', 'messages': ['0100']},
	{'code': 'println(binary(20, 3))', 'messages': ['100']},
	{'code': 'println(binary(#ff0201))', 'messages': ['111111110000001000000001']},
	{'code': 'println(binary(0xff0201))', 'messages': ['111111110000001000000001']},
	];
	processTranslateExecuteCases(cases, logger);
};