import { processTestCases } from
'../../processTestCases.js';
import { simplifyNotBinaryOperators } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyNotBinaryOperators.js';

export function testSimplifyNotBinaryOperators(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'not :x', 'logged': false},
		{'code': ':x > 3', 'logged': false},
		{'code': 'not :x > 3', 'to': ' :x <= 3', 'logged': true},
		{'code': 'not :x >= 3', 'to': ' :x < 3', 'logged': true},
		{'code': 'not :x < 3', 'to': ' :x >= 3', 'logged': true},
		{'code': 'not :x <= 3', 'to': ' :x > 3', 'logged': true},
		{'code': 'not :x = 3', 'to': ' :x <> 3', 'logged': true},
		{'code': 'not :x <> 3', 'to': ' :x = 3', 'logged': true},
		{'code': 'not (:x <> 3)', 'to': ' (:x = 3)', 'logged': true},
		{'code': 'not ((:x <> 3))', 'to': ' ((:x = 3))', 'logged': true}
	];
	processTestCases(cases, simplifyNotBinaryOperators, logger);
};