import { isIdentifierStart } from '../../../../modules/parsing/css/scanning/isIdentifierStart.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsIdentifierStart(logger) {
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
	{'in': '-', 'out': true},
	{'in': '--', 'out': true},
	{'in': 'x', 'out': true},
	{'in': 'f', 'out': true},
	{'in': '--x', 'out': true},
	{'in': '--_', 'out': true},
	{'in': '--xsdfsdf', 'out': true},
	{'in': '--my-color', 'out': true},
	{'in': '--My-color', 'out': true},
	{'in': 'var', 'out': true},
	{'in': 'rgb', 'out': true}
	];
	testInOutPairs(cases, isIdentifierStart, logger);
};