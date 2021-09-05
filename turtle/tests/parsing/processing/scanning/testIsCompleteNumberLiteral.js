import { isCompleteNumberLiteral } from
'../../../../modules/parsing/processing/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsCompleteNumberLiteral(logger) {
	const cases = [
	{'in': '0', 'out': true},
	{'in': '1', 'out': true},
	{'in': '-1', 'out': true},
	{'in': '-', 'out': false},
	{'in': '#FFCC00', 'out': true},
	{'in': '#006699', 'out': true},
	{'in': '0xFFFFCC00', 'out': true}
	];
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};