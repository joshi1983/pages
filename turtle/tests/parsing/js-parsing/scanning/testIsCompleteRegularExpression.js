import { isCompleteRegularExpression } from
'../../../../modules/parsing/js-parsing/scanning/isCompleteRegularExpression.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteRegularExpression(logger) {
	const cases = [
		{'in': '`', 'out': false},
		{'in': '/', 'out': false},
		{'in': '/!', 'out': false},
		{'in': '//', 'out': false},
		{'in': '/*/', 'out': false},
		{'in': '/[abc]+', 'out': false},
		{'in': '/[abc]+/', 'out': true},
		{'in': '/\\s+/g`', 'out': false},
		{'in': '/\\s+/g', 'out': true},
		{'in': '/\\s+/gi', 'out': true},
		{'in': '/\\s+/mi', 'out': true},
		{'in': '/\\s/', 'out': true},
		{'in': '/\\srpt/', 'out': true},
		{'in': '/\\srpt\\/', 'out': false},
		{'in': '/\\srpt\\s/', 'out': true},
		{'in': '/\\srpt\\s+/', 'out': true},
		{'in': '/\\srpt\\s+\\d/', 'out': true},
		{'in': '/[^\\w\\s]/gi', 'out': true},
		{'in': '/^[abc]+$/', 'out': true},
		{'in': '/!@#$%^&()%&[]{}|/', 'out': true},
		{'in': '/(http|https):\\/\\/[^ "/]+\\.[^ \n"\\]\']+/g', 'out': true},
		{'in': '/^[0-9A-F]+$/', 'out': true},
		{'in': '/^[0-9A-F]+$/i', 'out': true},
		{'in': '/=/', 'out': true},
		{'in': '/= /', 'out': true},
		{'in': '/ ;/', 'out': true},
		{'in': '/2);constx1=1/', 'out': false}
	];
	testInOutPairs(cases, isCompleteRegularExpression, logger);
};