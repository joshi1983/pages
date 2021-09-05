import { numberLiteralToValue } from
'../../../modules/parsing/processing/numberLiteralToValue.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testNumberLiteralToValue(logger) {
	const cases = [
	{'in': '1', 'out': 1},
	{'in': '-1', 'out': -1},
	{'in': '-10', 'out': -10},
	{'in': '-10.2', 'out': -10.2},
	{'in': '0xff', 'out': 255},
	{'in': '#ff', 'out': 255}
	];
	testInOutPairs(cases, numberLiteralToValue, logger);
};