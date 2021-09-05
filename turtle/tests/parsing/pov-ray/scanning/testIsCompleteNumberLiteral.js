import { isCompleteNumberLiteral } from
'../../../../modules/parsing/pov-ray/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

	const cases = [
	{'in': '', 'out': false},
	{'in': '/', 'out': false},
	{'in': ',', 'out': false},
	{'in': '.', 'out': false},
	{'in': '+', 'out': false},
	{'in': '-', 'out': false},
	{'in': 'e', 'out': false},
	{'in': 'E', 'out': false},
	{'in': 'e3', 'out': false},
	{'in': 'E3', 'out': false},
	{'in': 'e-3', 'out': false},
	{'in': 'E-3', 'out': false},
	{'in': ',0', 'out': false},
	{'in': ',6', 'out': false},
	{'in': ',60', 'out': false},
	{'in': '0,', 'out': false},
	{'in': '3,', 'out': false},
	{'in': '0', 'out': true},
	{'in': '3', 'out': true},
	{'in': '.5', 'out': true},
	{'in': '-.5', 'out': true},
	{'in': '123', 'out': true},
	{'in': '-123', 'out': true},
	{'in': '+123', 'out': true},
	{'in': '+123.', 'out': true},
	{'in': '+123.4', 'out': true},
	{'in': '123.45', 'out': true},
	{'in': '+123.45', 'out': true},
	{'in': '-123.45', 'out': true},
	{'in': '2e', 'out': false},
	{'in': '2e-', 'out': false},
	{'in': '3.4e', 'out': false},

	// a couple cases from https://www.povray.org/documentation/view/3.6.1/228/
	{'in': '2e-5', 'out': true},
	{'in': '3.4e6', 'out': true},
	];

export { cases };

export function testIsCompleteNumberLiteral(logger) {
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};