import { isCompleteIdentifier } from
'../../../../modules/parsing/css/scanning/isCompleteIdentifier.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteIdentifier(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': '4', 'out': false},
	{'in': '.', 'out': false},
	{'in': '/', 'out': false},
	{'in': '^', 'out': false},
	{'in': '[', 'out': false},
	{'in': '(', 'out': false},
	{'in': '---', 'out': false},
	{'in': '--x--', 'out': false},
	{'in': '-', 'out': false},
	{'in': '--', 'out': false},
	{'in': 'x', 'out': true},
	{'in': 'f', 'out': true},
	{'in': '--x', 'out': true},
	{'in': '--_', 'out': true},
	{'in': '--xsdfsdf', 'out': true},
	{'in': '--my-color', 'out': true},
	{'in': '--My-color', 'out': true},
	{'in': 'var', 'out': true},
	{'in': 'rgb', 'out': true},
	{'in': 'min-device-width', 'out': true},
	{'in': '-webkit-min-device-pixel-ratio', 'out': true}
	];
	testInOutPairs(cases, isCompleteIdentifier, logger);
};