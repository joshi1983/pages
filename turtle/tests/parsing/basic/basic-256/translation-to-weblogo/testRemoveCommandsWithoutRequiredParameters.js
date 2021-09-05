import { processTestCases } from
'../../../../components/code-editor/code-fixer/fixers/processTestCases.js';
import { removeCommandsWithoutRequiredParameters } from
'../../../../../modules/parsing/basic/basic-256/translation-to-weblogo/removeCommandsWithoutRequiredParameters.js';

/*
This and the removeCommandsWithoutRequiredParameters might not be worth maintaining.
This was started to fix some problems found while translating Basic 256 code like:
 DIM a(2)
 a[0] = 3
 print a[0]

The other problems were fixed other ways, though.

I'm writing this comment instead of removing it in case it is helpful later.
If not helpful for basic-256 translation, it might also be good to 
move to components/code-editor/code-fixer/helpers directory to help other translators.
*/
export function testRemoveCommandsWithoutRequiredParameters(logger) {
	const cases = [
		{'code': 'print "hi', 'logged': false},
		{'code': 'str', 'to': '', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'word', 'to': '', 'logged': true, 'ignoreParseErrors': true}
	];
	processTestCases(cases, removeCommandsWithoutRequiredParameters, logger);
};