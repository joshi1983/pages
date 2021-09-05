import { isValidInputToken } from '../../../../modules/parsing/sonic-webturtle/scanning/isValidInputToken.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsValidInputToken(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': '*', 'out': false},
	{'in': '-', 'out': false},
	{'in': '_', 'out': false},
	{'in': '?', 'out': false},
	{'in': '1', 'out': false},
	{'in': 'x', 'out': false},
	{'in': '^', 'out': true},
	{'in': '^1', 'out': true},
	{'in': '^2', 'out': true},
	{'in': '^3', 'out': true},
	{'in': '^4', 'out': true},
	{'in': '^5', 'out': true},
	{'in': '^6', 'out': true},
	{'in': '^7', 'out': true},
	{'in': '^8', 'out': true},
	];
	testInOutPairs(cases, isValidInputToken, logger);
};