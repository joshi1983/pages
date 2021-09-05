import { isCompleteStringLiteral } from
'../../../../modules/parsing/pov-ray/scanning/isCompleteStringLiteral.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteStringLiteral(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': '"', 'out': false},
	{'in': '"hi', 'out': false},
	{'in': '"hi"', 'out': true},
	{'in': '"Joe said', 'out': false},
	{'in': '"Joe "said"', 'out': false},
	{'in': '"Joe said \\"Hello\\" as he walked in."', 'out': true},
	];
	testInOutPairs(cases, isCompleteStringLiteral, logger);
};