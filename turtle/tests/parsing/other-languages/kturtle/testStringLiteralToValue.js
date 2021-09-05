import { stringLiteralToValue } from
'../../../../modules/parsing/other-languages/kturtle/stringLiteralToValue.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testStringLiteralToValue(logger) {
	const cases = [
	{'in': '""', 'out': ''},
	{'in': '"hello"', 'out': 'hello'},
	{'in': '"hello World"', 'out': 'hello World'},
	];
	testInOutPairs(cases, stringLiteralToValue, logger);
};