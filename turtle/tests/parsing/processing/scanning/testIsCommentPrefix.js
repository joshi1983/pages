import { isCommentPrefix } from
'../../../../modules/parsing/processing/scanning/isCommentPrefix.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCommentPrefix(logger) {
	const cases = [
	{'in': '', 'out': true},
	{'in': '"', 'out': false},
	{'in': '"\'', 'out': false},
	{'in': '" ', 'out': false},
	{'in': '""', 'out': false},
	{'in': '"""', 'out': false},
	{'in': "'", 'out': false},
	{'in': "''", 'out': false},
	{'in': "'''", 'out': false},
	{'in': '(', 'out': false},
	{'in': '#', 'out': false},
	{'in': '/', 'out': true},
	{'in': '//', 'out': true},
	{'in': '//\n', 'out': true},
	{'in': '// hello world\n', 'out': true},
	{'in': '/*', 'out': true},
	{'in': '/*\n', 'out': true},
	{'in': '/**/', 'out': true},
	{'in': '/* hello world */', 'out': true},
	];
	testInOutPairs(cases, isCommentPrefix, logger);
};