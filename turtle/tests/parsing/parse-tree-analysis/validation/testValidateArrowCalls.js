import { processValidationTestCases } from './processValidationTestCases.js';
import { validateArrowCalls } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateArrowCalls.js';

export function testValidateArrowCalls(logger) {
	const cases = [
		{'code': 'arrow 100 10 10', 'warn': false},
		{'code': 'setPenSize 10\narrow 100 10 10', 'warn': false},
		{'code': 'setPenSize 0\npenNormal\narrow 100 10 10', 'warn': false},
		{'code': 'setPenSize 0\narrow 100 10 10', 'warn': true}
	];
	cases.forEach((caseInfo) => {caseInfo.error = false;});
	processValidationTestCases(cases, logger, validateArrowCalls);
};