import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { tokenContainsVariableAssignments } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/tokenContainsVariableAssignments.js';

function wrappedTokenContainsVariableAssignments(code) {
	const parseResult = parse(code);
	return tokenContainsVariableAssignments(parseResult.root, 'i');
}

export function testTokenContainsVariableAssignments(logger) {
	// We'll look specifically for assignments to a variable named i.
	const cases = [
		{'in': 'print(i)', 'out': false},
		{'in': 'print(i < 2)', 'out': false},
		{'in': 'print(i + 2)', 'out': false},
		{'in': 'print(i - 2)', 'out': false},
		{'in': 'print(i == 2)', 'out': false},
		{'in': 'i()', 'out': false},
		{'in': 'x = 1', 'out': false},
		{'in': 'x = i', 'out': false},
		{'in': 'x = i * 2', 'out': false},
		{'in': 'I = 1', 'out': false},
		{'in': 'i = 1', 'out': true},
		{'in': 'i++', 'out': true},
		{'in': 'i--', 'out': true},
		{'in': '++i', 'out': true},
		{'in': '--i', 'out': true},
		{'in': '++i++', 'out': true},
		{'in': '--i--', 'out': true},
		{'in': 'i+=2', 'out': true},
		{'in': 'i-=2', 'out': true},
		{'in': 'i*=2', 'out': true},
		{'in': 'i/=2', 'out': true}
	];
	testInOutPairs(cases, wrappedTokenContainsVariableAssignments, logger);
};