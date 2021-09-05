import { processValidationTestCases } from './processValidationTestCases.js';
import { validateAlwaysReturnValue } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateAlwaysReturnValue.js';

export function testValidateAlwaysReturnValue(logger) {
	const cases = [
		{'code': 'print map "sin [1 2 3]', 'error': false},
		{'code': 'print map "fd [1 2 3]', 'error': true},
		{'code': `to p :num
end

print map "p [1 2 3]`, 'error': true},
		{'code': `to p :num
	output 2 * :num
end

print map "p [1 2 3]`, 'error': false},
		{'code': `to p :num
	if randomRatio < 0.4 [
		stop
	]
	output :num
end

print map "p [1 2 3]`, 'error': true},
	];
	processValidationTestCases(cases, logger, validateAlwaysReturnValue);
};