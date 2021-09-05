import { isCommentComplete } from
'../../../../modules/parsing/css/scanning/isCommentComplete.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsCommentComplete(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'a', 'out': false},
	{'in': 'ab', 'out': false},
	{'in': '/', 'out': false},
	{'in': '/*', 'out': false},
	{'in': '/*hello', 'out': false},
	{'in': '/* hello', 'out': false},
	{'in': '/* hello */', 'out': true},

	// some non-standard comments because some web browsers support single-line comments in CSS
	{'in': '//', 'out': false},
	{'in': '//\n', 'out': true},
	];
	testInOutPairs(cases, isCommentComplete, logger);
};