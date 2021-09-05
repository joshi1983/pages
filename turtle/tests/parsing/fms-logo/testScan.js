import { processScanTestCases } from '../processScanTestCases.js';
import { scan } from
'../../../modules/parsing/fms-logo/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': 'fd 1', 'tokens': [
		{'s': 'fd', 'colIndex': 1, 'lineIndex': 0},
		{'s': '1', 'colIndex': 3, 'lineIndex': 0}
	]},
	{'code': 'print [hi world]',
		'tokens': ['print', '[', 'hi', 'world',
			{'s': ']', 'colIndex': 15}
		]
	},
	{'code': 'print [It\'s a wonderful world]',
		'tokens': [
			{'s': 'print', 'colIndex': 4, 'lineIndex': 0},
			{'s': '[', 'colIndex': 6, 'lineIndex': 0},
			{'s': 'It\'s', 'colIndex': 10, 'lineIndex': 0},
			{'s': 'a', 'colIndex': 12, 'lineIndex': 0},
			{'s': 'wonderful', 'colIndex': 22, 'lineIndex': 0}, 
			{'s': 'world', 'colIndex': 28, 'lineIndex': 0},
			{'s': ']', 'colIndex': 29, 'lineIndex': 0}
		]
	},
	{'code': 'print \'hi\'',
		'tokens': ['print',
			{'s': '\'hi\'', 'colIndex': 9}
		]
	},
	{'code': 'print \n\'hi\'',
		'tokens': [
			{'s': 'print', 'colIndex': 4, 'lineIndex': 0},
			{'s': '\n', 'colIndex': 6, 'lineIndex': 0},
			{'s': '\'hi\'', 'colIndex': 3, 'lineIndex': 1}
		]
	},
	{'code': 'print\n\'hi\'',
		'tokens': [
			{'s': 'print', 'colIndex': 4, 'lineIndex': 0},
			{'s': '\n', 'colIndex': 5, 'lineIndex': 0},
			{'s': '\'hi\'', 'colIndex': 3, 'lineIndex': 1}
		]
	},
	{'code': 'print[\'hi\']',
		'tokens': [
			{'s': 'print', 'colIndex': 4, 'lineIndex': 0},
			{'s': '[', 'colIndex': 5, 'lineIndex': 0},
			{'s': '\'hi\'', 'colIndex': 9, 'lineIndex': 0},
			{'s': ']', 'colIndex': 10, 'lineIndex': 0},
		]
	},
	{'code': 'print {1 2 3}',
	'tokens': ['print', '{', '1', '2', '3', '}']},
	{'code': 'print {}',
	'tokens': ['print', '{', '}']},
	{'code': '{}@0', 'tokens': ['{', '}@0']},
	{'code': '{1 2 3}@0', 'tokens': ['{', '1', '2', '3',
	{'s': '}@0', 'colIndex': 8, 'lineIndex': 0}]},
	{'code': '{1 2 3}@1', 'tokens': ['{', '1', '2', '3',
	{'s': '}@1', 'colIndex': 8, 'lineIndex': 0}]},
	{'code': '{1 2 3}@2', 'tokens': ['{', '1', '2', '3',
	{'s': '}@2', 'colIndex': 8, 'lineIndex': 0}]},
	{'code': '{ \'}\'}@1', 'tokens': [
		'{',
		{'s': "'}'", 'colIndex': 4, 'lineIndex': 0},
		{'s': '}@1', 'colIndex': 7, 'lineIndex': 0}
	]},
	];
	processScanTestCases(cases, scan, logger);
};