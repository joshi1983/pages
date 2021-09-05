import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testForeachExecution(logger) {
	const cases = [
	{'code': 'FOREACH [5] []',
	'messages': []
	},
	{'code': 'FOREACH [5] [foreach [x y] [print ?] print ?]',
	'messages': ['x', 'y', '5']
	},
	{'code': 'FOREACH [5] [print ? foreach [x y] [print ?] print ?]',
	'messages': ['5', 'x', 'y', '5']
	},
	{'code': 'FOREACH [5] [print # foreach [x y] [print #] print #]',
	'messages': ['1', '1', '2', '1']
	},
	{'code': 'FOREACH [5] [print ?rest foreach [x y] [print ?rest] print ?rest]',
	'messages': ['[]', '[y]', '[]', '[]']
	},
	{'code': 'FOREACH [5 4 3 2 1] [print #]',
	'messages': ['1', '2', '3', '4', '5']
	},
	{'code': 'FOREACH [5 4 3 2 1] [print ?]',
	'messages': ['5', '4', '3', '2', '1']
	},
	{'code': 'FOREACH [a b c] [print ?]',
	'messages': ['a', 'b', 'c']
	},
	{'code': 'FOREACH [3 2 1] [print ?rest]',
	'messages': ['[2 1]', '[1]', '[]']
	},


	// as shown at: https://fmslogo.sourceforge.io/manual/command-foreach.html
	{'code': 'FOREACH [a b c d] [PRINT (SENTENCE "index # "value ? "rest ?REST)]',
	'messages': [
		'[index 1 value a rest b c d]',
		'[index 2 value b rest c d]',
		'[index 3 value c rest d]',
		'[index 4 value d rest]'
	]
	}
	];
	processTranslateExecuteCases(cases, logger);
};