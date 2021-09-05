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
	{'in': '\'hi\'', 'out': true}
	];
	testInOutPairs(cases, isStringLiteralStart, logger);
};