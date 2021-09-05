import { isStartingRegularExpression } from
'../../../../modules/parsing/js-parsing/scanning/isStartingRegularExpression.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStartingRegularExpression(logger) {
	const cases = [
		{'in': '`', 'out': false},
		{'in': '/', 'out': true},
		{'in': '/*/', 'out': false},
		{'in': '//', 'out': false},
		{'in': '/!', 'out': true},
		{'in': '/[abc]+', 'out': true},
		{'in': '/\\s+`', 'out': true},
		{'in': '/[^\\w\\s]', 'out': true},
		{'in': '/^[abc]+', 'out': true},
		{'in': '/!@#$%^&()%&[]{}', 'out': true},
		{'in': '/^[0-9A-F]+', 'out': true},
	];
	testInOutPairs(cases, isStartingRegularExpression, logger);
};