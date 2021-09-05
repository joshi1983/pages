import { isCompleteComment } from
'../../../../modules/parsing/processing/scanning/isCompleteComment.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteComment(logger) {
	const cases = [
	// # is a comment available for Python code using Processing.
	// We're trying to scan and parse the more Java-like Processing programming language, though.
	{'in': '#', 'out': false},
	{'in': '#\n', 'out': false},
	{'in': '# hello world\n', 'out': false},
	{'in': '//', 'out': false},
	{'in': '//\n', 'out': true},
	{'in': '// hello world\n', 'out': true},
	{'in': '/*', 'out': false},
	{'in': '/*\n', 'out': false},
	{'in': '/*/', 'out': false},
	{'in': '/**/', 'out': true},
	{'in': '/* hello world */', 'out': true},
	];
	testInOutPairs(cases, isCompleteComment, logger);
};