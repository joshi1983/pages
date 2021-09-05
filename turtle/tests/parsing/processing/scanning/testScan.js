import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/processing/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'len': 0},
		{'code': '\t\r\n', 'len': 0},
		{'code': ',', 'len': 1},
		{'code': '1,2', 'len': 3},
		{'code': '0.85', 'len': 1},
		{'code': '4', 'len': 1, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0}
		]},
		{'code': '"hello"', 'len': 1},
		{'code': '"hello world"', 'len': 1},
		{'code': '"hello\tworld"', 'len': 1},
		{'code': '"hello\rworld"', 'len': 1},
		{'code': '"hello\nworld"', 'len': 1},
		{'code': 'x/3', 'len': 3},
		{'code': 'x/y', 'len': 3},
		{'code': 'x/y/z', 'len': 5},
		{'code': 'x / 3', 'len': 3},
		{'code': '123', 'len': 1, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0}
		]},
		{'code': 'var123', 'len': 1, 'tokens': [
			{'colIndex': 5, 'lineIndex': 0}
		]},
		{'code': 'v1 += 0', 'len': 3, 'tokens': [
			{'colIndex': 1, 'lineIndex': 0},
			{'colIndex': 4, 'lineIndex': 0},
			{'colIndex': 6, 'lineIndex': 0}
		]},
		{'code': 'abc(x-4)', 'len': 6, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0, 's': 'abc'},
			{'colIndex': 3, 'lineIndex': 0, 's': '('},
			{'colIndex': 4, 'lineIndex': 0, 's': 'x'},
			{'colIndex': 5, 'lineIndex': 0, 's': '-'},
			{'colIndex': 6, 'lineIndex': 0, 's': '4'},
			{'colIndex': 7, 'lineIndex': 0, 's': ')'}
		]
		},
		{'code': '(x*y)-123', 'len': 7, 'tokens': [
			{'s': '('},
			{'s': 'x'},
			{'s': '*'},
			{'s': 'y'},
			{'s': ')'},
			{'s': '-'},
			{'s': '123'}
		]
		},
		{'code': '(x*y)+123', 'len': 7, 'tokens': [
			{'s': '('},
			{'s': 'x'},
			{'s': '*'},
			{'s': 'y'},
			{'s': ')'},
			{'s': '+'},
			{'s': '123'}
		]
		},
		{'code': '1+4', 'len': 3, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0, 's': '1'},
			{'colIndex': 1, 'lineIndex': 0, 's': '+'},
			{'colIndex': 2, 'lineIndex': 0, 's': '4'}
		]},
		{'code': 'ia', 'len': 1},
		{'code': '1/4', 'len': 3, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0, 's': '1'},
			{'colIndex': 1, 'lineIndex': 0, 's': '/'},
			{'colIndex': 2, 'lineIndex': 0, 's': '4'}
		]},
		{'code': '++', 'len': 1},
		{'code': '++x', 'len': 2, 'tokens': ['++', 'x']},
		{'code': '--x', 'len': 2, 'tokens': ['--', 'x']},
		{'code': '--', 'len': 1},
		{'code': 'i--', 'len': 2},
		{'code': '--i', 'len': 2},
		{'code': '*=', 'len': 1},
		{'code': '/=', 'len': 1},
		{'code': '%=', 'len': 1},
		{'code': '+=', 'len': 1},
		{'code': '-=', 'len': 1},
		{'code': '<=', 'len': 1},
		{'code': '>=', 'len': 1},
		{'code': '==', 'len': 1},
		{'code': '2 == 5', 'len': 3, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0, 's': '2'},
			{'colIndex': 3, 'lineIndex': 0, 's': '=='},
			{'colIndex': 5, 'lineIndex': 0, 's': '5'}
		]},
		{'code': '2==5', 'len': 3, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0, 's': '2'},
			{'colIndex': 2, 'lineIndex': 0, 's': '=='},
			{'colIndex': 3, 'lineIndex': 0, 's': '5'}
		]},
		{'code': 'b /=', 'len': 2},
		{'code': 'b /= a', 'len': 3},
		{'code': 'b/=a', 'len': 3},

		{'code': 'b += a', 'len': 3},
		{'code': 'b *= a', 'len': 3},
		{'code': '/ ', 'len': 1},
	];
	processScanTestCases(cases, scan, logger);
};