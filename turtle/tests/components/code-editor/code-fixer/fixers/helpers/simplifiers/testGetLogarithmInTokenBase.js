import { assertEquals } from
'../../../../../../helpers/assertEquals.js';
import { codeToToken } from
'./codeToToken.js';
import { exceptionToString } from
'../../../../../../../modules/exceptionToString.js';
import { getLogarithmInTokenBase } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/getLogarithmInTokenBase.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetLogarithmInTokenBase(logger) {
	const cases = [
		{'inArgs': [':y', ':x'], 'out': undefined},
		{'inArgs': ['tan :x', '(sin :y) / cos :x'], 'out': undefined},
		{'inArgs': ['tan :x', '(sin :x) / cos :y'], 'out': undefined},
		{'inArgs': ['1/tan :x', '(cos :y) / sin :x'], 'out': undefined},
		{'inArgs': ['1/tan :x', '(cos :x) / sin :y'], 'out': undefined},
		{'inArgs': [':x', ':x'], 'out': 1},
		{'inArgs': ['tan :x', '(sin :x) / cos :x'], 'out': 1},
		{'inArgs': ['1/tan :x', '(cos :x) / sin :x'], 'out': 1},
		{'inArgs': ['1', ':x'], 'out': 0},
		{'inArgs': ['1', ':y'], 'out': 0},
		{'inArgs': ['8', '2'], 'out': 3},
		{'inArgs': [':x / :x', ':x'], 'out': 0},
		{'inArgs': ['1 / :x', ':x'], 'out': -1},
		{'inArgs': [':x * :x', ':x'], 'out': 2},
		{'inArgs': ['sqrt :x', ':x'], 'out': 0.5},
		{'inArgs': ['sqrt sqrt :x', ':x'], 'out': 0.25},
		{'inArgs': [':x', 'sqrt :x'], 'out': 2},
		{'inArgs': [':x', 'sqrt sqrt :x'], 'out': 4},
		{'inArgs': ['1 / power :x 2', ':x'], 'out': -2},
		{'inArgs': ['1 / sqrt :x', ':x'], 'out': -0.5},
		{'inArgs': ['power :x 2', ':x'], 'out': 2},
		{'inArgs': ['power sqrt :x 2', ':x'], 'out': 1},
		{'inArgs': ['power :x 3', ':x'], 'out': 3},
		{'inArgs': [':x * power :x 3', ':x'], 'out': 4},
		{'inArgs': ['(sqrt :x) * power :x 3', ':x'], 'out': 3.5},
	];

	cases.forEach(function(caseInfo, index) {
		const inArgs = caseInfo.inArgs;
		const plogger = prefixWrapper(`Case ${index}, Calculating logarithm of ${inArgs[0]} with base ${inArgs[1]}`, logger);
		try {
			const tokens = inArgs.map(codeToToken);
			const result = getLogarithmInTokenBase(...tokens);
			assertEquals(caseInfo.out, result, plogger);
		} catch (e) {
			console.error(e);
			plogger(`Error/exception thrown. e=${exceptionToString(e)}`);
		}
	});
};