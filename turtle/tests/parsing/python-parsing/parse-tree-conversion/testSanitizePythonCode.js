import { sanitizePythonCode } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/sanitizePythonCode.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testSanitizePythonCode(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'import turtle', 'out': 'import turtle'},
	{'in': '>>>import turtle', 'out': 'import turtle'},
	{'in': '...import turtle', 'out': 'import turtle'},
	{'in': 'import random\n...import turtle', 'out': 'import random\nimport turtle'},
	{'in': '"""\n>>> """', 'out': '"""\n>>> """'},
	{'in': '"""\n... """', 'out': '"""\n... """'},
	];
	testInOutPairs(cases, sanitizePythonCode, logger);
};