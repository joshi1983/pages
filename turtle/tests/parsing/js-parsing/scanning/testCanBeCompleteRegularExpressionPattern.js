import { canBeCompleteRegularExpressionPattern } from '../../../../modules/parsing/js-parsing/scanning/canBeCompleteRegularExpressionPattern.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testCanBeCompleteRegularExpressionPattern(logger) {
	const cases = [
	{'in': '', 'out': true},
	{'in': '\\', 'out': false},
	{'in': '[01', 'out': false},
	{'in': '[01]', 'out': true},
	{'in': '[01]]', 'out': false},
	{'in': '[01)', 'out': false},
	{'in': '01]', 'out': false},
	{'in': '(http|https):\\/\\/[^ "/]+\\.[^ \n"\\]\']+', 'out': true}
	];
	testInOutPairs(cases, canBeCompleteRegularExpressionPattern, logger);
};
