import { isStringLiteralStart } from '../../../../modules/parsing/css/scanning/isStringLiteralStart.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStringLiteralStart(logger) {
	const cases = [
	{'in': '.', 'out': false},
	{'in': '`', 'out': false},
	{'in': '4', 'out': false},
	{'in': '"', 'out': true},
	{'in': '"hi', 'out': true},
	{'in': '"hi"', 'out': true},
	{'in': '\'', 'out': true},
	{'in': '\'hi', 'out': true},
	{'in': '\'hi\'', 'out': true},
	{'in': '../hello.css', 'out': true}, // no quotes but still a string literal in CSS.
	{'in': './hello.css', 'out': true},
	{'in': '/hello.css', 'out': true},
	];
	testInOutPairs(cases, isStringLiteralStart, logger);
};