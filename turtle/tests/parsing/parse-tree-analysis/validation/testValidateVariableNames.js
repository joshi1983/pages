import { validateVariableNames } from '../../../../modules/parsing/parse-tree-analysis/validation/validateVariableNames.js';
import { processValidationTestCase } from './processValidationTestCase.js';

export function testValidateVariableNames(logger) {
	const cases = [
	{'code': '', 'error': false},
	{'code': 'make "x 1', 'error': false}, // good name
	{'code': 'make x 1', 'error': true}, // must start with quote
	{'code': 'make "f?f 1', 'error': true}, // f?f in the middle of the variable makes the name invalid
	{'code': 'to hello\nmake "x 1\nend', 'error': false},
	{'code': 'to hello\nmake "f?f 1\nend', 'error': true},
	{'code': 'to hello :f?f\nprint :f?f\nend', 'error': true},
	{'code': 'make \'x\' 4', 'error': true},
	{'code': 'make "red 4', 'error': false, 'warn': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateVariableNames);
	});
}