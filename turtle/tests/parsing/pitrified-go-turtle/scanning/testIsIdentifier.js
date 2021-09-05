import { isIdentifier } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '3', 'out': false},
		{'in': '-', 'out': false},
		{'in': '+', 'out': false},
		{'in': '&', 'out': false},
		{'in': '%', 'out': false},
		{'in': '*', 'out': false},
		{'in': '/', 'out': false},

		// a few cases copied from: https://go.dev/ref/spec
		{'in': 'a', 'out': true},
		{'in': '_x9', 'out': true},
		{'in': 'ThisVariableIsExported', 'out': true},
		{'in': 'αβ', 'out': true}
	];
	// some cases copied from https://www.geeksforgeeks.org/go-language/go-programming-language-introduction/
	const valids = ['_geeks23', 'geeks', 'gek23sd',
	'Geeks', 'geeKs', 'geeks_geeks'];
	for (const v of valids) {
		cases.push({
			'in': v,
			'out': true
		});
	}
	
	testInOutPairs(cases, isIdentifier, logger);
};