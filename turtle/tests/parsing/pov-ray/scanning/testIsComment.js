import { isComment } from
'../../../../modules/parsing/pov-ray/scanning/isComment.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs';

export function testIsComment(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': '/', 'out': false},
	{'in': '//', 'out': true},
	{'in': '// hello world', 'out': true},
	{'in': '/*', 'out': true},
	{'in': '/**/', 'out': true},
	{'in': '/* hello world */', 'out': true},
	{'in': '/*\nhello\nworld\n*/', 'out': true},
	];
	testInOutPairs(cases, isComment, logger);
};