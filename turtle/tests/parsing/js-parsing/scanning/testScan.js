import { fetchJson } from '../../../../modules/fetchJson.js';
import { processScanTestCases } from './processScanTestCases.js';
import { scan } from '../../../../modules/parsing/js-parsing/scanning/scan.js';
const operators = await fetchJson('json/JavaScript/operators.json');

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
		{'code': '0xffffffff', 'len': 1},
		{'code': '0x123', 'len': 1},
		{'code': '-0x123', 'len': 1},
		{'code': '"hello"', 'len': 1},
		{'code': '"hello world"', 'len': 1},
		{'code': '"hello\tworld"', 'len': 1},
		{'code': '"hello\rworld"', 'len': 1},
		{'code': '"hello\nworld"', 'len': 1},
		{'code': '"hello\\"world"', 'len': 1},
		{'code': 'const x = {}', 'len': 5},
		{'code': '.', 'len': 1},
		{'code': '..', 'len': 2}, // invalid token.  2 dots are the closest we can get to valid tokens.
		{'code': '...', 'len': 1}, // spread operator
		{'code': 'x/3', 'len': 3},
		{'code': 'x/y', 'len': 3},
		{'code': 'x/y/z', 'len': 5},
		{'code': 'x / 3', 'len': 3},
		{'code': 'x // 3', 'len': 2, 'tokens': [
			{'colIndex': 0},
			{'colIndex': 5}
		]},
		{'code': '123', 'len': 1, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0}
		]},
		{'code': 'var123', 'len': 1, 'tokens': [
			{'colIndex': 5, 'lineIndex': 0}
		]},
		{'code': 'var v1', 'len': 2, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0},
			{'colIndex': 5, 'lineIndex': 0}
		]},
		{'code': 'let v1;', 'len': 3, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0},
			{'colIndex': 5, 'lineIndex': 0},
			{'colIndex': 6, 'lineIndex': 0}
		]},
		{'code': 'let v1 = 0', 'len': 4, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0},
			{'colIndex': 5, 'lineIndex': 0},
			{'colIndex': 7, 'lineIndex': 0},
			{'colIndex': 9, 'lineIndex': 0}
		]},
		{'code': 'v1 += 0', 'len': 3, 'tokens': [
			{'colIndex': 1, 'lineIndex': 0},
			{'colIndex': 4, 'lineIndex': 0},
			{'colIndex': 6, 'lineIndex': 0}
		]},
		{'code': 'let v1=0', 'len': 4, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0},
			{'colIndex': 5, 'lineIndex': 0},
			{'colIndex': 6, 'lineIndex': 0},
			{'colIndex': 7, 'lineIndex': 0}
		]},
		{'code': 'let x=-4', 'len': 4, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0},
			{'colIndex': 4, 'lineIndex': 0},
			{'colIndex': 5, 'lineIndex': 0},
			{'colIndex': 7, 'lineIndex': 0}
		]
		},
		{'code': 'log(x-4)', 'len': 6, 'tokens': [
			{'colIndex': 2, 'lineIndex': 0, 's': 'log'},
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
		{'code': 'context.turtle.setLineCap(0)', 'len': 8},
		{'code': 'try', 'len': 1},
		{'code': 'typeof', 'len': 1},
		{'code': 'instanceof', 'len': 1},
		{'code': 'ia', 'len': 1},
		{'code': '1/4', 'len': 3, 'tokens': [
			{'colIndex': 0, 'lineIndex': 0, 's': '1'},
			{'colIndex': 1, 'lineIndex': 0, 's': '/'},
			{'colIndex': 2, 'lineIndex': 0, 's': '4'}
		]},
		{'code': 'try {} finally {}', 'len': 6},
		{'code': ':case', 'len': 2},
		{'code': 'case 2:case', 'len': 4},
		{'code': '??=', 'len': 1},
		{'code': '?', 'len': 1},
		{'code': '*=', 'len': 1},
		{'code': '/=', 'len': 1},
		{'code': '+=', 'len': 1},
		{'code': '-=', 'len': 1},
		{'code': '<=', 'len': 1},
		{'code': '>=', 'len': 1},
		{'code': '==', 'len': 1},
		{'code': '===', 'len': 1},
		{'code': '>>>', 'len': 1},
		{'code': 'b /=', 'len': 2},
		{'code': 'b /= a', 'len': 3},
		{'code': 'b/=a', 'len': 3},
		{'code': '/=a', 'len': 2},
		// /=a/ is a regular expression but '/=a' terminates before the last /.

		{'code': 'b += a', 'len': 3},
		{'code': 'b *= a', 'len': 3},
		{'code': '1000 >>> 2', 'len': 3},
		{'code': '``', 'len': 1},
		{'code': '`length`', 'len': 1},
		{'code': '`length${x}`', 'len': 1},
		{'code': '/ ', 'len': 1},
		{'code': '//', 'len': 1}, // comment
		{'code': '// hello', 'len': 1}, // comment
		{'code': '//*', 'len': 1}, // comment
		{'code': '/!@#$%^&()%&[]{}|/', 'len': 1}, // weird looking regular expression
		{'code': '/^[0-9A-F]+$/i', 'len': 1},
		{'code': '/(http|https):\\/\\/[^ "/]+\\.[^ \n"\\]\']+/g', 'len': 1},
		{'code': '/\\srpt\\s+\\d/, // some comment', 'len': 3},
		{'code': '/[\\r\\n]omark\\s/,', 'len': 2},
		{'code': '/\\srpt\\s+\\d/', 'len': 1},
		{'code': '/\\ssbgc\\s/', 'len': 1},
		{'code': `[
//
/\srpt\s+\d/
]`, 'len': 4},
		{'code': '//\n/', 'len': 2},
		{'code': '//\n/h/', 'len': 2},
		{'code': '//\n/\\srpt/', 'len': 2}, // comment followed by a regex
		{'code': 'return /^[0-9A-F]+$/i', 'len': 2},
		{'code': 'return /^[0-9A-F]+$/i.', 'len': 3, 'tokens': [
			{'colIndex': 5},
			{'colIndex': 20},
			{'colIndex': 21}
		]},
		{'code': 'd /= a\n q = 3/9', 'len': 8, 'tokens': [
			{'s': 'd'},
			{'s': '/='},
			{'s': 'a'},
			{'s': 'q'},
			{'s': '='},
			{'s': '3'},
			{'s': '/'},
			{'s': '9'}
		]},
		{'code': `// comment1
/[A-Z]/ // comment2`, 'len': 3,
		'tokens': [
			{'s': '// comment1'},
			{'s': '/[A-Z]/'},
			{'s': '// comment2'}
		]}
	];
	operators.forEach(function(operatorInfo) {
		cases.push({'code': operatorInfo.symbol, 'len': 1});
	});
	processScanTestCases(cases, scan, logger);
};