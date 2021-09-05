import { processValidationTestCase } from './processValidationTestCase.js';
import { validateProcedureNames } from '../../../../modules/parsing/parse-tree-analysis/validation/validateProcedureNames.js';

function testBasicValidateProcedureNames(logger) {
	const cases = [
	{'code': '', 'error': false},
	{'code': 'to hello\nend', 'error': false}, // good name
	{'code': 'to\nend', 'parseFail': true, 'error': false}, // missing name
	{'code': 'to to\nend', 'parseFail': true, 'error': true}, // keyword
	{'code': 'to end\nend', 'error': true}, // keyword
	{'code': 'to true\nend', 'parseFail': true, 'error': true}, // keyword
	{'code': 'to false\nend', 'parseFail': true, 'error': true}, // keyword
	{'code': 'to fd\nend', 'error': true}, // command name abbreviation
	{'code': 'to forward\nend', 'error': true}, // command name
	{'code': 'to hello\nend\nto fd\nend', 'error': true}, // good name and bad name
	{'code': 'to hello2\nend', 'error': false}, // numbers allowed at the end
	{'code': 'to hello\nend\nto HELLO\nend', 'error': true}, // duplicate names
	{'code': 'to hel#lo\nend', 'parseFail': true}, // bad name character '#'
	{'code': 'to hel&lo\nend', 'parseFail': true}, // bad name character '&'
	{'code': 'to 3\nend', 'parseFail': true},
	{'code': 'to []\nend\n', 'parseFail': true, 'error': true},
	{'code': 'to ()\nend\n', 'parseFail': true, 'error': true},
	{'code': 'to "x\nend\n', 'parseFail': true, 'error': true},
	{'code': 'to undefined\nend', 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateProcedureNames);
	});
}

export function testValidateProcedureNames(logger) {
	testBasicValidateProcedureNames(logger);
}