import { isPreprocessorIdentifier } from
'../../../../../modules/parsing/basic/qbasic/scanning/isPreprocessorIdentifier.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsPreprocessorIdentifier(logger) {
	const cases = [
	{'in': 'x', 'out': false},
	{'in': 'str$', 'out': false},
	{'in': 'str$as', 'out': false},
	{'in': '$str$', 'out': false},
	{'in': '$STR$', 'out': false},

	// some names from https://qb64phoenix.com/qb64wiki/index.php/Metacommand
	{'in': '$EXEICON', 'out': true},
	{'in': '$DYNAMIC', 'out': true},
	{'in': '$STATIC', 'out': true},
	{'in': '$MIDISOUNDFONT', 'out': true},
	{'in': '$VERSIONINFO', 'out': true},
	{'in': '$NOPREFIX', 'out': true},
	{'in': '$ELSE', 'out': true},
	{'in': '$ERROR', 'out': true},
	{'in': '$ELSEIF', 'out': true},
	];
	testInOutPairs(cases, isPreprocessorIdentifier, logger);
};