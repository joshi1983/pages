import { areTokensEvaluatingEqual } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/areTokensEvaluatingEqual.js';
import { assertEquals } from
'../../../../../../helpers/assertEquals.js';
import { codeToToken } from
'./codeToToken.js';
import { exceptionToString } from
'../../../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testAreTokensEvaluatingEqual(logger) {
	const cases = [
		{'inArgs': ['power :x 2', ':x'], 'out': false},
		{'inArgs': ['log10 power 9 :x', ':x'], 'out': false},
		{'inArgs': ['ln power 3 :x', ':x'], 'out': false},
		{'inArgs': ['ln power 10 :x', ':x'], 'out': false},
		{'inArgs': ['log10 exp :x', ':x'], 'out': false},
		{'inArgs': ['tan :x', 'sin :x'], 'out': false},
		{'inArgs': ['tan :x', 'cos :x'], 'out': false},
		{'inArgs': [':x', ':y'], 'out': false},
		{'inArgs': [':x + 1', ':x + 2'], 'out': false},
		{'inArgs': ['exp :x', 'power 2 :x'], 'out': false},
		{'inArgs': ['exp :x', 'power 2.7 :x'], 'out': false},
			// 2.7 is not close enough to E(2.718281828459045...).

		{'inArgs': ['exp ln :x', ':x'], 'out': true},
		{'inArgs': ['power 2.718281828459045 ln :x', ':x'], 'out': true},
		{'inArgs': ['1', '0'], 'out': false},
		{'inArgs': [':x', ':x'], 'out': true},
		{'inArgs': ['1', '1'], 'out': true},
		{'inArgs': ['(:x)', ':x'], 'out': true},
		{'inArgs': ['(((:x)))', ':x'], 'out': true},
		{'inArgs': ['abs :x', 'abs -:x'], 'out': true},
		{'inArgs': ['cos :x', 'cos -:x'], 'out': true},
		{'inArgs': ['radCos :x', 'radCos -:x'], 'out': true},
		{'inArgs': ['exp :x', 'power 2.718281828459045 :x'],
			'out': true},
		{'inArgs': ['ln power 2.718281828459045 :x', ':x'], 'out': true},
		{'inArgs': ['ln exp :x', ':x'], 'out': true},
		{'inArgs': ['ln 1', '0'], 'out': true},
		{'inArgs': ['log10 1', '0'], 'out': true},
		{'inArgs': ['log10 10', '1'], 'out': true},
		{'inArgs': ['power :x -1', '1/:x'], 'out': true},
		{'inArgs': ['power :x 2', ':x*:x'], 'out': true},
		{'inArgs': ['power :x 0.5', 'sqrt :x'], 'out': true},
		{'inArgs': ['power :x 1.5', ':x * sqrt :x'], 'out': true},
		{'inArgs': ['power :x 3', ':x*:x*:x'], 'out': true},
		{'inArgs': ['power :x 3', ':x*power :x 2'], 'out': true},
		{'inArgs': ['tan :x', '(sin :x) / (cos :x)'], 'out': true},
		{'inArgs': [':x + 1', '1 + :x'], 'out': true},
		{'inArgs': ['log10 power 10 :x', ':x'], 'out': true},
	];
	// Equality should be reflexive so add cases with the inArgs swapped.
	for (const caseInfo of cases.slice()) {
		const inArgs = caseInfo.inArgs;
		if (inArgs[0] !== inArgs[1]) // if swapping will make a meaningful difference
			cases.push({'inArgs': [inArgs[1], inArgs[0]],
				'out': caseInfo.out});
	}
	cases.forEach(function(caseInfo, index) {
		const inArgs = caseInfo.inArgs;
		const plogger = prefixWrapper(`Case ${index}, comparing ${inArgs[0]} with ${inArgs[1]}`, logger);
		try {
			const tokens = inArgs.map(codeToToken);
			const result = areTokensEvaluatingEqual(...tokens);
			assertEquals(caseInfo.out, result, plogger);
		} catch (e) {
			console.error(e);
			plogger(`Error/exception thrown. e=${exceptionToString(e)}`);
		}
	});
};