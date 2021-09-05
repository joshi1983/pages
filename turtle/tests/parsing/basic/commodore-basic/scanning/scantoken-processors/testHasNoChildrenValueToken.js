import { hasNoChildrenValueToken } from
'../../../../../../modules/parsing/basic/commodore-basic/scanning/scantoken-processors/hasNoChildrenValueToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testHasNoChildrenValueToken(logger) {
	const cases = [
		{'in': '-', 'out': false},
		{'in': '>', 'out': false},
		{'in': '<', 'out': false},
		{'in': '=', 'out': false},
		{'in': '*', 'out': false},
		{'in': '+', 'out': false},
		{'in': '/', 'out': false},
		{'in': '\\', 'out': false},
		{'in': '1', 'out': true},
		{'in': '2', 'out': true},
		{'in': '-2', 'out': true},
		{'in': 'x', 'out': true},
		{'in': 'sin', 'out': false},
		{'in': 'end', 'out': false},
		{'in': 'sub', 'out': false},
		{'in': 'to', 'out': false}
	];
	testInOutPairs(cases, hasNoChildrenValueToken, logger);
};