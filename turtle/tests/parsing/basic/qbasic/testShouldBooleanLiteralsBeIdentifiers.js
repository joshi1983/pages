import { scan } from
'../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { shouldBooleanLiteralsBeIdentifiers } from
'../../../../modules/parsing/basic/qbasic/shouldBooleanLiteralsBeIdentifiers.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedShouldBooleanLiteralsBeIdentifiers(code) {
	const tokens = scan(code);
	return shouldBooleanLiteralsBeIdentifiers(tokens);
}

export function testShouldBooleanLiteralsBeIdentifiers(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'let x = 3', 'out': false},
		{'in': 'const x = 3', 'out': false},
		{'in': 'dim x(3)', 'out': false},
		{'in': 'x = true', 'out': false},
		{'in': 'if x = true then\nend if', 'out': false},
		{'in': 'if true = x then\nend if', 'out': false},
		{'in': 'dim true(2)', 'out': true},
		{'in': 'let true = 3', 'out': true},
		{'in': 'const true = 3', 'out': true},
		{'in': 'sub true()\nend sub', 'out': true},
		{'in': 'function true()\nend function', 'out': true},
		{'in': 'def true()\nend def', 'out': true},
	];
	testInOutPairs(cases, wrappedShouldBooleanLiteralsBeIdentifiers, logger);
};