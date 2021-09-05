import { cases as completeCases } from './testIsCompleteNumberLiteral.js';
import { isNumberLiteral } from
'../../../../modules/parsing/pov-ray/scanning/isNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs';

export function testIsNumberLiteral(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': '/', 'out': false},
	{'in': ',', 'out': false},
	{'in': '.', 'out': false},
	{'in': '+', 'out': false},
	{'in': '-', 'out': false},
	{'in': 'e', 'out': false},
	{'in': 'E', 'out': false},
	{'in': '.e', 'out': false},
	{'in': '.E', 'out': false},
	{'in': '-.e', 'out': false},
	{'in': '-.E', 'out': false},
	{'in': '+.e', 'out': false},
	{'in': '+.E', 'out': false},
	{'in': ',0', 'out': false},
	{'in': ',6', 'out': false},
	{'in': ',60', 'out': false},
	{'in': '0,', 'out': false},
	{'in': '3,', 'out': false},

	// a couple cases from https://www.povray.org/documentation/view/3.6.1/228/
	{'in': '2e-', 'out': true},
	{'in': '3.4e', 'out': true},
	];
	completeCases.forEach(function(caseInfo) {
		// All complete numbers should return true.
		if (caseInfo.out === true)
			cases.push(caseInfo);
	});
	testInOutPairs(cases, isNumberLiteral, logger);
};