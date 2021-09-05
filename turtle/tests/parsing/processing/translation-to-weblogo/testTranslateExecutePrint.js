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
	{'code': 'println(binary(\'A\', 8))', 'messages': ['01000001']},
	{'code': 'println(binary(\'B\', 8))', 'messages': ['01000010']},
	{'code': 'color c = #ffcc00; println(hex(c));', 'messages': ['FFFFCC00']},
	{'code': 'color c = #ffcc00; println(hex(c, 6));', 'messages': ['FFCC00']},
	{'code': 'println(hex(\'?\'));', 'messages': ['3F']},
	{'code': 'println(hex(\'A\'));', 'messages': ['41']},
	{'code': 'println(hex(\'B\'));', 'messages': ['42']},
	];
	processTranslateExecuteCases(cases, logger);
};