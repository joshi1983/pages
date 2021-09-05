import { isIdentifier } from
'../../../../../../modules/parsing/other-languages/pascal/turing/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	/*
	Most of these test cases are based on descriptions of identifiers
	for variables at:
	https://compsci.ca/holtsoft/IPT.pdf
	chapter 5, more specifically 5.2.1 Names of Variables
	*/
	const cases = [
		{'in': '3', 'out': false},
		{'in': '.', 'out': false},
		{'in': '-', 'out': false},
		{'in': '$', 'out': false},
		{'in': '^', 'out': false},
		{'in': 'a.', 'out': false},
		{'in': 'a ', 'out': false},
		{'in': 'a\t', 'out': false},
		{'in': 'a', 'out': true},
		{'in': 'a3', 'out': true},
		{'in': 'a_', 'out': true},
		{'in': 'this_year', 'out': true},
		{'in': 'thisYear', 'out': true},
	];
	testInOutPairs(cases, isIdentifier, logger);
};