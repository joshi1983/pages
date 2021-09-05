import { isStartOfPseudoClass } from '../../../../modules/parsing/css/scanning/isStartOfPseudoClass.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStartOfPseudoClass(logger) {
	const cases = [
	{'in': '.', 'out': false},
	{'in': '`', 'out': false},
	{'in': '4', 'out': false},
	{'in': '"', 'out': false},
	{'in': ':"', 'out': false},
	{'in': ':\'', 'out': false},
	{'in': ':1', 'out': false},
	{'in': ':none', 'out': false},
	{'in': ':', 'out': true},
	{'in': ':h', 'out': true},
	{'in': ':hover', 'out': true},
	{'in': ':s', 'out': true},
	{'in': ':scope', 'out': true},
	{'in': ':past', 'out': true},
	{'in': ':t', 'out': true},
	{'in': ':tar', 'out': true},
	{'in': ':target', 'out': true},
	{'in': ':target-', 'out': true},
	{'in': ':target-w', 'out': true},
	{'in': ':target-with', 'out': true},
	{'in': ':volume-', 'out': true},
	{'in': ':volume-locked', 'out': true},
	{'in': '::before', 'out': true},
	];
	testInOutPairs(cases, isStartOfPseudoClass, logger);
};