import { mightBeLabelName } from
'../../../../../../modules/parsing/other-languages/basic/liberty-basic/scanning/mightBeLabelName.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testMightBeLabelName(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '3', 'out': false},
		{'in': '.', 'out': false},
		{'in': ':', 'out': false},
		{'in': 'x', 'out': true},
		{'in': 'xyz', 'out': true}
	];
	testInOutPairs(cases, mightBeLabelName, logger);
};